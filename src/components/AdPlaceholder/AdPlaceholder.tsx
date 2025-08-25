import React from 'react';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import './AdPlaceholder.css';

interface AdPlaceholderProps {
  isVisible: boolean;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="ad-placeholder">
      <div className="ad-placeholder-content">
        <IonHeader className="ad-header">
          <IonToolbar color="light">
            <IonTitle size="small">Advertisement Placeholder</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ad-content">
          <p>Ads only appear in the native app</p>
          <p className="small-text">This is a placeholder for the web version</p>
        </IonContent>
      </div>
    </div>
  );
};

export default AdPlaceholder;
