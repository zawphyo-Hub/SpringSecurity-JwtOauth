import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
import AppTheme from '../../Shared-Theme/AppTheme';
import ColorModeSelect from '../../Shared-Theme/ColorModeSelect';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//-------------------Styling Sign In Form-------------------
const Card = styled(MuiCard)(({ theme }) => ({
      display: 'flex',
      flexDirection: 'column',
      alignSelf: 'center',
      width: '100%',
      padding: theme.spacing(4),
      gap: theme.spacing(2),
      margin: 'auto',
      [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
      },
      boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
      ...theme.applyStyles('dark', {
        boxShadow:
          'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      }),
    }));

    const SignInContainer = styled(Stack)(({ theme }) => ({
      height: 'calc((1 - var(--template-frame-height, 0)) * auto)',
      minHeight: '100%',
      overflowY: 'auto', 
      padding: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
      },
      '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
          'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
      },
}));

function SignIn(props){
      
  

    //-----------------------Handling Function----------------------------
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const isValid = validateInputs();

      if (!isValid) {
        return;
      }
      
      
      try {
        const res =  await axios.post('http://localhost:8080/api/v1/auth/authentication', {email, password});
        const token = res.data.token; // Save token for authenticated requests
       
        
        if (res.data.mfaEnabled) {
          toast.info("Enter verification code from authenticator app.")
          navigate("/totplogin", { state: { email } }); // send email
        } else {
          localStorage.setItem("token", token);
          console.log("Jwt token:",token);
          toast.success("Login successful!");
          navigate("/home");
        }
       
        
    } catch (error) {
       if(error.response && error.response.data && error.response.data.message){
          toast.error(error.response.data.message)
       }else{
          toast.error("Login Error!!")

       }
       
    }
    };

    const validateInputs = () => {
     

      let isValid = true;

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailError(true);
        setEmailErrorMessage('Please enter a valid email address.');
        isValid = false;
      } else {
        setEmailError(false);
        setEmailErrorMessage('');
      }

      if (!password) {
        setPasswordError(true);
        setPasswordErrorMessage('Please enter your password!');
        isValid = false;
      } else {
        setPasswordError(false);
        setPasswordErrorMessage('');
      }

      return isValid;
    };

    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google"

    }

    return(
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
          <Card variant="outlined">
            {/* <SitemarkIcon /> */}
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%',   fontSize: 'clamp(1.5rem, 8vw, 1.5rem)'}}
            >
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate //this skips the browser built-in validation such as "this field is required"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={emailError ? 'error' : 'primary'}
                  type="email"
                  
                  variant="outlined"
                  
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                /> */}
                <ForgotPassword open={open} handleClose={handleClose} />
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  
                >
                  Forgot your password?
                </Link>

              </Box>
              
              <Button
                type="submit"
                fullWidth
                
                variant="contained"
                // onClick={validateInputs}
              >
                Sign in
              </Button>
              
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleLogin}
                startIcon={<GoogleIcon />}
              >
                Sign in with Google
              </Button>
              {/* <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Sign in with Facebook')}
                startIcon={<FacebookIcon />}
              >
                Sign in with Facebook
              </Button> */}
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  variant="body2"
                  
                  sx={{ alignSelf: 'center' }}
                >
                  Sign up
                </Link>
              </Typography>
              
            </Box>
          </Card>
          
        </SignInContainer>
      </AppTheme>
    )
}
export default SignIn;

// const Card = styled(MuiCard)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignSelf: 'center',
//   width: '100%',
//   padding: theme.spacing(4),
//   gap: theme.spacing(2),
//   margin: 'auto',
//   [theme.breakpoints.up('sm')]: {
//     maxWidth: '450px',
//   },
//   boxShadow:
//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//   ...theme.applyStyles('dark', {
//     boxShadow:
//       'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
//   }),
// }));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   height: 'calc((1 - var(--template-frame-height, 0)) * 120vh)',
//   minHeight: '100%',
//   overflowY: 'auto', 
//   padding: theme.spacing(2),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4),
//   },
//   '&::before': {
//     content: '""',
//     display: 'block',
//     position: 'absolute',
//     zIndex: -1,
//     inset: 0,
//     backgroundImage:
//       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     ...theme.applyStyles('dark', {
//       backgroundImage:
//         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//     }),
//   },
// }));

// export default function SignIn(props) {
//   const [emailError, setEmailError] = React.useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
//   const [passwordError, setPasswordError] = React.useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleSubmit = (event) => {
//     if (emailError || passwordError) {
//       event.preventDefault();
//       return;
//     }
//     const data = new FormData(event.currentTarget);
//     console.log({
//       email: data.get('email'),
//       password: data.get('password'),
//     });
//   };

//   const validateInputs = () => {
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');

//     let isValid = true;

//     if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
//       setEmailError(true);
//       setEmailErrorMessage('Please enter a valid email address.');
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage('');
//     }

//     if (!password.value || password.value.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMessage('Password must be at least 6 characters long.');
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage('');
//     }

//     return isValid;
//   };

  // return (
    // <AppTheme {...props}>
    //   <CssBaseline enableColorScheme />
    //   <SignInContainer direction="column" justifyContent="space-between">
    //     {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
    //     <Card variant="outlined">
    //       {/* <SitemarkIcon /> */}
    //       <Typography
    //         component="h1"
    //         variant="h4"
    //         sx={{ width: '100%',  textAlign: 'center', fontSize: 'clamp(1.5rem, 6vw, 1rem)' }}
    //       >
    //         Sign In
    //       </Typography>
    //       <Box
    //         component="form"
    //         onSubmit={handleSubmit}
    //         noValidate
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           width: '100%',
    //           gap: 2,
    //         }}
    //       >
    //         <FormControl>
    //           <FormLabel htmlFor="email">Email</FormLabel>
    //           <TextField
    //             error={emailError}
    //             helperText={emailErrorMessage}
    //             id="email"
    //             type="email"
    //             name="email"
    //             placeholder="your@email.com"
    //             autoComplete="email"
    //             autoFocus
    //             required
    //             fullWidth
    //             variant="outlined"
    //             color={emailError ? 'error' : 'primary'}
    //           />
    //         </FormControl>
    //         <FormControl>
    //           <FormLabel htmlFor="password">Password</FormLabel>
    //           <TextField
    //             error={passwordError}
    //             helperText={passwordErrorMessage}
    //             name="password"
    //             placeholder="••••••"
    //             type="password"
    //             id="password"
    //             autoComplete="current-password"
    //             autoFocus
    //             required
    //             fullWidth
    //             variant="outlined"
    //             color={passwordError ? 'error' : 'primary'}
    //           />
    //         </FormControl>
    //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //           <FormControlLabel
    //           control={<Checkbox value="remember" color="primary" />}
    //           label="Remember me"
    //           />
    //           <ForgotPassword open={open} handleClose={handleClose} />
    //           <Link
    //             component="button"
    //             type="button"
    //             onClick={handleClickOpen}
    //             variant="body2"
    //             // sx={{ alignSelf: 'center' }}
    //           >
    //             Forgot your password?
    //           </Link>

    //         </Box>
            
    //         <Button
    //           type="submit"
    //           fullWidth
    //           variant="contained"
    //           onClick={validateInputs}
    //         >
    //           Sign in
    //         </Button>
            
    //       </Box>
    //       <Divider>or</Divider>
    //       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    //         <Button
    //           fullWidth
    //           variant="outlined"
    //           onClick={() => alert('Sign in with Google')}
    //           startIcon={<GoogleIcon />}
    //         >
    //           Sign in with Google
    //         </Button>
    //         <Button
    //           fullWidth
    //           variant="outlined"
    //           onClick={() => alert('Sign in with Facebook')}
    //           startIcon={<FacebookIcon />}
    //         >
    //           Sign in with Facebook
    //         </Button>
    //         <Typography sx={{ textAlign: 'center' }}>
    //           Don&apos;t have an account?{' '}
    //           <Link
    //             href="/material-ui/getting-started/templates/sign-in/"
    //             variant="body2"
    //             sx={{ alignSelf: 'center' }}
    //           >
    //             Sign up
    //           </Link>
    //         </Typography>
    //       </Box>
    //     </Card>
    //   </SignInContainer>
    // </AppTheme>
//   );
// }
