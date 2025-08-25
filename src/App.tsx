import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";
import { admobService } from "./services/admobService";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  // Initialize AdMob at the app level
  useEffect(() => {
    const initAdMob = async () => {
      try {
        console.log("Initializing AdMob at App level");
        await admobService.initialize();
        console.log("AdMob initialized at App level");
      } catch (error) {
        console.error("Error initializing AdMob:", error);
      }
    };

    initAdMob();
  }, []);

  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/auth">
            <AuthPage />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
