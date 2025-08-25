import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  IonToast,
  IonToggle,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { APP_NAME, DATA } from "../app-data";
import * as AppGeneral from "../components/socialcalc/index.js";
import { useEffect, useState } from "react";
import { Local } from "../components/Storage/LocalStorage";
import { menu, settings, arrowUndoOutline, arrowRedoOutline, personCircleOutline, personRemoveOutline } from "ionicons/icons";
import "./Home.css";
import Menu from "../components/Menu/Menu";
import Files from "../components/Files/Files";
import NewFile from "../components/NewFile/NewFile";
import { useAutoSave } from "../hooks/useAutoSave";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { authService } from "../services/authService";
import { admobService } from "../services/admobService";
import { App } from "@capacitor/app";
import AdPlaceholder from "../components/AdPlaceholder/AdPlaceholder";

const Home: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showPopover, setShowPopover] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({ open: false, event: undefined });
  const [selectedFile, updateSelectedFile] = useState("default");
  const [billType, updateBillType] = useState(1);
  const [device] = useState("default");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAdPlaceholder, setShowAdPlaceholder] = useState(false);
  const { currentUser } = useAuth();
  const history = useHistory();

  const store = new Local();

  // Auto-save hook with fixed 15-second interval and no notifications
  const { startAutoSave, stopAutoSave } = useAutoSave(
    store,
    selectedFile,
    billType,
    {
      intervalMs: 15000, // 15 seconds fixed
      enabled: selectedFile !== "default", // Always enabled except for default file
      onSave: () => {
        // Silent auto-save, no notifications
      },
      onError: (error) => {
        // Only show critical errors
        if (error.includes("critical")) {
          setToastMessage(error);
          setShowToast(true);
        }
      }
    }
  );

  const closeMenu = () => {
    setShowMenu(false);
  };

  const activateFooter = (footer) => {
    AppGeneral.activateFooterButton(footer);
  };

  const handleUndo = () => {
    try {
      AppGeneral.undo();
      setToastMessage("Undo successful");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Cannot undo");
      setShowToast(true);
    }
  };

  const handleRedo = () => {
    try {
      AppGeneral.redo();
      setToastMessage("Redo successful");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Cannot redo");
      setShowToast(true);
    }
  };

  // Keyboard shortcuts for undo/redo
  useKeyboardShortcuts(handleUndo, handleRedo);

  // Authentication handlers
  const handleLogin = () => {
    history.push('/auth');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setToastMessage("Logged out successfully!");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage("Logout failed: " + error.message);
      setShowToast(true);
    }
  };

  // Initialize AdMob when component mounts
  useEffect(() => {
    // Home component is now visible, show the banner ad
    const showAd = async () => {
      try {
        console.log("Showing banner ad in Home component");
        await admobService.showBanner();
        // Update the placeholder visibility for web
        setShowAdPlaceholder(admobService.isWebPlaceholderVisible());
      } catch (error) {
        console.error("Error showing banner ad:", error);
      }
    };

    // Small delay to ensure the view is fully rendered
    const timer = setTimeout(() => {
      showAd();
    }, 1000);

    // Add app state change listeners to handle ad visibility
    let listener: any;
    const setupListener = async () => {
      listener = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          // App came to foreground
          console.log("App active, resuming banner");
          admobService.resumeBanner().then(() => {
            setShowAdPlaceholder(admobService.isWebPlaceholderVisible());
          });
        } else {
          // App went to background
          console.log("App inactive, hiding banner");
          admobService.hideBanner().then(() => {
            setShowAdPlaceholder(false);
          });
        }
      });
    };
    
    setupListener();

    return () => {
      // Clean up
      clearTimeout(timer);
      console.log("Home component unmounting, removing banner");
      admobService.removeBanner().then(() => {
        setShowAdPlaceholder(false);
      });
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  useEffect(() => {
    const data = DATA["home"][device]["msc"];
    AppGeneral.initializeApp(JSON.stringify(data));
  }, []);

  useEffect(() => {
    activateFooter(billType);
  }, [billType]);

  const footers = DATA["home"][device]["footers"];
  const footersList = footers.map((footerArray) => {
    return (
      <IonButton
        key={footerArray.index}
        expand="full"
        color="light"
        className="ion-no-margin"
        onClick={() => {
          updateBillType(footerArray.index);
          activateFooter(footerArray.index);
          setShowPopover({ open: false, event: undefined });
        }}
      >
        {footerArray.name}
      </IonButton>
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{APP_NAME}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToolbar color="primary">
          <IonIcon
            icon={arrowUndoOutline}
            slot="end"
            className="ion-padding-end"
            size="large"
            onClick={handleUndo}
            style={{ cursor: 'pointer' }}
            title="Undo"
          />
          <IonIcon
            icon={arrowRedoOutline}
            slot="end"
            className="ion-padding-end"
            size="large"
            onClick={handleRedo}
            style={{ cursor: 'pointer' }}
            title="Redo"
          />
          <IonIcon
            icon={currentUser ? personRemoveOutline : personCircleOutline}
            slot="end"
            className="ion-padding-end auth-icon"
            size="large"
            onClick={currentUser ? handleLogout : handleLogin}
            style={{ 
              cursor: 'pointer',
              color: 'white'
            }}
            title={currentUser ? "Logout" : "Login"}
          />
          <IonIcon
            icon={settings}
            slot="end"
            className="ion-padding-end"
            size="large"
            onClick={(e) => {
              setShowPopover({ open: true, event: e.nativeEvent });
              console.log("Popover clicked");
            }}
          />
          <Files
            store={store}
            file={selectedFile}
            updateSelectedFile={updateSelectedFile}
            updateBillType={updateBillType}
          />

          <NewFile
            file={selectedFile}
            updateSelectedFile={updateSelectedFile}
            store={store}
            billType={billType}
          />
          <IonPopover
            animated
            keyboardClose
            backdropDismiss
            event={showPopover.event}
            isOpen={showPopover.open}
            onDidDismiss={() =>
              setShowPopover({ open: false, event: undefined })
            }
          >
            <div style={{ padding: '10px' }}>
              {footersList}
            </div>
          </IonPopover>
        </IonToolbar>
        <IonToolbar color="secondary">
          <IonTitle className="ion-text-center">
            Editing : {selectedFile}
            {selectedFile !== 'default' && (
              <div style={{ fontSize: '11px', color: '#4CAF50', marginTop: '2px', opacity: 0.8 }}>
                Auto-save enabled
              </div>
            )}
          </IonTitle>
        </IonToolbar>

        {/* Menu FAB button - moved higher to avoid ad overlap */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ bottom: '80px' }}>
          <IonFabButton type="button" onClick={() => setShowMenu(true)}>
            <IonIcon icon={menu} />
          </IonFabButton>
        </IonFab>

        <Menu
          showM={showMenu}
          setM={closeMenu}
          file={selectedFile}
          updateSelectedFile={updateSelectedFile}
          store={store}
          bT={billType}
        />

        <div id="container">
          <div id="workbookControl"></div>
          <div id="tableeditor"></div>
          <div id="msg"></div>
        </div>
        
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="bottom"
          color={toastMessage.includes('successful') ? 'success' : 
                 toastMessage.includes('Auto-saved') ? 'success' : 'danger'}
        />
        
        {/* Ad placeholder for web browser */}
        <AdPlaceholder isVisible={showAdPlaceholder} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
