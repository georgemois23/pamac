import React, { useContext, useState, useEffect } from 'react';
import { Button, Container, Typography, Stack, Box, InputBase } from '@mui/material';
import api, { useAxiosInterceptor } from "../../api/axios";
import AuthContext from "../../AuthContext";
import ContentNotAvaiable from '../ContentNotAvailable';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../../context/SnackbarContext';
import GlobalDialog from '../../components/GlobalDialog';

// --- FIXED: Component defined OUTSIDE the main function ---
// This prevents the input from losing focus after every character
const ProfileRow = ({ label, name, value, onChange, isEditing, isEditable = true }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center',  }}>
            {/* Label */}
            <Typography sx={{ width: '100px', textAlign: 'right', fontWeight: 'bold', color: '#a4c2f4' }}>
                {label}:
            </Typography>

            {/* The Design Box */}
            <Box sx={{ 
                border: '2px solid #a4c2f4', 
                borderRadius: '15px', 
                padding: '8px 15px', 
                width: '300px', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '45px'
            }}>
                {isEditing && isEditable ? (
                    // EDIT MODE: Simple Input
                    <InputBase
                        name={name}
                        value={value}
                        onChange={onChange} // Calls the handler passed from parent
                        fullWidth
                        autoComplete="off"
                        sx={{ 
                            color: '#a4c2f4', 
                            textAlign: 'center',
                            '& input': { textAlign: 'center' } 
                        }}
                    />
                ) : (
                    // VIEW MODE: Simple Text
                    <Typography sx={{ color: '#a4c2f4', textAlign: 'center', width: '100%' }}>
                        {value || <span style={{ opacity: 0.5, fontStyle: 'italic' }}></span>}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

// --- MAIN COMPONENT ---
function Profile({ user }) {
    const { incognito , refetchUser} = useContext(AuthContext); 
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const { showSnackbar } = useSnackbar();
    
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   const handleSave = async () => {
    // 1. Extract values from the formData state
    const { email, first_name, last_name } = formData;

    try {
      // 2. Send data to backend
      const response = await api.patch(`/users/${user.id}`, {
        email,
        first_name,
        last_name
});

      console.log("Saved successfully:", response.data);

      await refetchUser(); // Refresh user data after saving

      // 3. Close edit mode ONLY if the API call succeeds
      setIsEditing(false);


    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleOpen = () => {
     setDialogOpen(!dialogOpen);
  }
    
  const handleForgotPassword = async () => {
    // const { email} = formData;

    try {
      // 2. Send data to backend
      const response = await api.post('/auth/forgot-password', {
        email: user.email, username: user.username
    });

      console.log("Saved successfully:", response.data);

      await refetchUser(); // Refresh user data after saving

      // 3. Close edit mode ONLY if the API call succeeds
      setIsEditing(false);
      showSnackbar({
        message: "If your credentials match, you will receive a reset email.",
        severity: "info",
      });


    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

    const handleCancel = () => {
        setFormData({
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || ''
        });
        setIsEditing(false);
    };

    if (incognito) return <ContentNotAvaiable />;

    return (
        <Container sx={{ minHeight: '100vh', pt: 5, textAlign: 'center', color: '#a4c2f4',zIndex: 3 }}>
            
            <Typography variant='h3' sx={{ fontFamily: "Advent Pro", mb: 4 }}>
                {user.username ? `${user.username} ` : ""} {t("profile")}
            </Typography>

            <Stack spacing={3} alignItems="center">
                
                {/* Username (Always Read-Only) */}
                <ProfileRow 
                    label={t("username")} 
                    value={user.username} 
                    isEditing={false} 
                />

                {!isEditing ? (
                    // VIEW MODE
                    <>
                        <ProfileRow 
                            label="Email" 
                            value={user.email} 
                            isEditing={false} 
                        />
                        <ProfileRow 
                            label={t("fullname")} 
                            value={`${user.first_name || ''} ${user.last_name || ''}`} 
                            isEditing={false} 
                        />
                    </>
                ) : (
                    // EDIT MODE
                    <>
                        <ProfileRow 
                            label="Email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            isEditing={true} 
                        />
                        <ProfileRow 
                            label={"First Name"} 
                            name="first_name" 
                            value={formData.first_name} 
                            onChange={handleChange} 
                            isEditing={true} 
                        />
                        <ProfileRow 
                            label={"Last Name"} 
                            name="last_name" 
                            value={formData.last_name} 
                            onChange={handleChange} 
                            isEditing={true} 
                        />
                    </>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {!isEditing ? (
                        <Button 
                            variant="contained" 
                            onClick={() => setIsEditing(true)}
                            sx={{ borderRadius: '15px', px: 4 }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <>
                            <Button variant="outlined" color="error" onClick={handleCancel} sx={{ borderRadius: '15px' }}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={handleSave} sx={{ borderRadius: '15px' }}>
                                Save
                            </Button>
                            {user.email && <Button variant="contained" onClick={handleOpen} sx={{ borderRadius: '15px' }}>
                                Change Password
                            </Button>}
                        </>
                    )}
                    
                </Stack>
                   
            </Stack>
            <GlobalDialog onOpen={dialogOpen} open={dialogOpen} onClose={handleOpen}
                title={"Change Password"}
                primaryButtonText={"Send Reset Email"}
                onPrimaryClick={handleForgotPassword}
                secondaryButtonText={"Cancel"}
                onSecondaryClick={() => {handleOpen();}}
            >
                <Typography>
                    {"Are you sure you want to send a password reset email to " + user.email + "?"}
                </Typography>
            </GlobalDialog>
        </Container>
    );
}

export default Profile;