// import { Button, Fieldset, Input, Stack } from "@chakra-ui/react"
// import { Field } from "./components/ui/field"
// import React, { useState } from 'react';
// import {
//   NativeSelectField,
//   NativeSelectRoot,
// } from "./components/ui/native-select"
// import { PasswordInput } from "./components/ui/password-input";

// function Form ({type,onSubmit}) {
//     const [username,setUsername]= useState('');
//     const [password,setPassword]= useState('');
//     function changeUsername(e) {
//         setUsername(e.target.value);
//       }
    
//       function changePassword(e) {
//         setPassword(e.target.value);
//       }
//       function submit(){
//         // e.preventDefault();
//         onSubmit(true,username,PasswordInput);
//       }

//   return (
//     <Fieldset.Root size="lg" maxW="md" borderRadius={'20px'} alignContent={'center'} marginTop={'1rem'} onSubmit={submit}>
//       <Stack>
//         <Fieldset.Legend>{type}</Fieldset.Legend>
//         <Fieldset.HelperText>
//           Please provide your contact details below.
//         </Fieldset.HelperText>
//       </Stack>

//       <Fieldset.Content>
//         <Field label="Username">
//           <Input name="username" value={username} onChange={changeUsername} maxLength={16} placeholder="Type your username" />
//         </Field>

//         <Field label="Password">
//           <Input name="password" value={password} onChange={changePassword} type="password" maxLength={16} placeholder="*********" minLength={8} required/>
//         </Field>

        
//       </Fieldset.Content>

//       <Button disabled={(!username || !password)} type="submit" height={'40px'} alignSelf="center" marginBottom={'1rem'} _disabled={{opacity:0.6, cursor:'default'}}>
//         {/* {button} */}
//         {type}
//       </Button>
//     </Fieldset.Root>
//   )
// }

// export default Form;
