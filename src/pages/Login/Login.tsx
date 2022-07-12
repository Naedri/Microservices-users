import { IonButton, IonCard, IonContent, IonInput, IonLabel, IonList, IonPage, IonRouterLink } from '@ionic/react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Form from '../../components/Form';
import Header from '../../components/Header';
import { UserContext } from '../../contexts/user.context';
import { login } from '../../services/rest/auth';
import type { ErrorFromServer } from '../../types/interfaces/error';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Theme variables */
import '../../theme/variables.css';

/* Component CSS */
import './Login.module.css';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logError, setError] = useState<ErrorFromServer | null>(null);
  const [logSuccess, setLogSuccess] = useState(false);
  const { stateUser, dispatchUser } = useContext(UserContext);

  const { t, i18n } = useTranslation('auth');

  async function logInUser(event: Event): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);

    //TODO improve type of form
    const email: string = (event.target as any).email.value;
    const password: string = (event.target as any).password.value;
    const { user, error } = await login({ email, password });

    setLoading(false);

    if (user) {
      dispatchUser({ user: user });
      setLogSuccess(true);
    } else {
      if (error?.response?.status === 404) {
        error.message = `${t('invalidIdentification')} ${t('tryAgain')}`;
      } else {
        error.message = `${t('unknown')}`;
      }
      setError(error);
    }
  }

  return (
    <IonPage id="login-page">
      <Header pageTitle={t('LoginPageTitle')} i18n={i18n} t={t} />
      <IonContent fullscreen>
        <Form onSubmit={logInUser}>
          <IonList>
            <IonCard>
              <IonLabel> Email </IonLabel>
              <IonInput id="email" type="email" name="email" placeholder={t('emailExample')} required />
            </IonCard>
            <IonCard>
              <IonLabel> Password </IonLabel>
              <IonInput id="password" type="password" name="password" required />
            </IonCard>
          </IonList>

          <IonButton type="submit" disabled={loading}>
            {loading ? t('loading') : t('login')}
          </IonButton>
          <small>
            {t('qMissingAccount')}
            <IonRouterLink href="/signup">
              <a>{t('signup')}</a>
            </IonRouterLink>
          </small>

          {logError && <p className="error">{logError.message}</p>}
          {logSuccess && <p>{t('redirectingToProfile')}</p>}
        </Form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
