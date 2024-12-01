import React, { useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import {
  LoginPage,
  LoginForm,
  ListItem,
  ListVariant,
  LoginFooterItem,
  LoginMainFooterBandItem,
  LoginMainFooterLinksItem,
  Button
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { useAuthStore } from '../store/authState';
// Import social media icons if needed
import {
  GoogleIcon,
  GithubIcon,
  DropboxIcon,
  FacebookSquareIcon,
  GitlabIcon
} from '@patternfly/react-icons';

const Login: React.FC = () => {
  const [showHelperText, setShowHelperText] = useState(false);
  const [username, setUsername] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);

  const history = useHistory();
  const { login, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const handleUsernameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setUsername(value);
    setIsValidUsername(true);
    setShowHelperText(false);
  };

  const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setPassword(value);
    setIsValidPassword(true);
    setShowHelperText(false);
  };

  const onRememberMeClick = () => {
    setIsRememberMeChecked(!isRememberMeChecked);
  };

  const onLoginButtonClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (!username || !password) {
      setIsValidUsername(!!username);
      setIsValidPassword(!!password);
      setShowHelperText(true);
      return;
    }

    try {
      await login(username, password);
      history.push('/');
    } catch (err) {
      setShowHelperText(true);
      setIsValidUsername(false);
      setIsValidPassword(false);
    }
  };

  const socialMediaLoginContent = (
    <React.Fragment>
      <LoginMainFooterLinksItem>
        <Button variant="plain" aria-label="Login with Google" icon={<GoogleIcon />} />
      </LoginMainFooterLinksItem>
      <LoginMainFooterLinksItem>
        <Button variant="plain" aria-label="Login with Github" icon={<GithubIcon />} />
      </LoginMainFooterLinksItem>
      <LoginMainFooterLinksItem>
        <Button variant="plain" aria-label="Login with Dropbox" icon={<DropboxIcon />} />
      </LoginMainFooterLinksItem>
      <LoginMainFooterLinksItem>
        <Button variant="plain" aria-label="Login with Facebook" icon={<FacebookSquareIcon />} />
      </LoginMainFooterLinksItem>
      <LoginMainFooterLinksItem>
        <Button variant="plain" aria-label="Login with Gitlab" icon={<GitlabIcon />} />
      </LoginMainFooterLinksItem>
    </React.Fragment>
  );

  const signUpForAccountMessage = (
    <LoginMainFooterBandItem>
      Need an account? <a href="#">Sign up.</a>
    </LoginMainFooterBandItem>
  );

  const forgotCredentials = (
    <LoginMainFooterBandItem>
      <a href="#">Forgot username or password?</a>
    </LoginMainFooterBandItem>
  );

  const listItem = (
    <React.Fragment>
      <ListItem>
        <LoginFooterItem href="#">Terms of Use</LoginFooterItem>
      </ListItem>
      <ListItem>
        <LoginFooterItem href="#">Help</LoginFooterItem>
      </ListItem>
      <ListItem>
        <LoginFooterItem href="#">Privacy Policy</LoginFooterItem>
      </ListItem>
    </React.Fragment>
  );

  const loginForm = (
    <LoginForm
      showHelperText={showHelperText}
      helperText="Invalid login credentials."
      helperTextIcon={<ExclamationCircleIcon />}
      usernameLabel="Username"
      usernameValue={username}
      onChangeUsername={handleUsernameChange}
      isValidUsername={isValidUsername}
      passwordLabel="Password"
      passwordValue={password}
      onChangePassword={handlePasswordChange}
      isValidPassword={isValidPassword}
      rememberMeLabel="Keep me logged in for 30 days."
      isRememberMeChecked={isRememberMeChecked}
      onChangeRememberMe={onRememberMeClick}
      onLoginButtonClick={onLoginButtonClick}
      loginButtonLabel="Log in"
    />
  );

  return (
    <LoginPage
      footerListVariants={ListVariant.inline}
      // brandImgSrc={brandImg2}
      brandImgAlt="PatternFly logo"
      backgroundImgSrc="/assets/images/pfbg-icon.svg"
      footerListItems={listItem}
      textContent="This is placeholder text only. Use this area to place any information or introductory message about your application that may be relevant to users."
      loginTitle="Log in to your account"
      loginSubtitle="Enter your single sign-on LDAP credentials."
      socialMediaLoginContent={socialMediaLoginContent}
      socialMediaLoginAriaLabel="Log in with social media"
      signUpForAccountMessage={signUpForAccountMessage}
      forgotCredentials={forgotCredentials}
    >
      {loginForm}
    </LoginPage>
  );
};

export { Login };
