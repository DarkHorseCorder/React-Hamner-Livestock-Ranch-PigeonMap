import { awaitAPICall } from './apiWrapper';
import Cookies from 'js-cookie';

export default function logout(props = null) {
   let body = {}
   let auth_token = Cookies.get('auth_token')
   if (auth_token) {
      body["auth_token"] = auth_token
   }
   let user_id = Cookies.get('user_id')
   if (user_id) {
      body["user_id"] = user_id
   }
   Cookies.remove("auth_token");
   Cookies.remove("user_role");
   Cookies.remove("user_name");
   Cookies.remove("auth_expires");
   Cookies.remove("org_id")

   awaitAPICall(`/user/logout`, "PUT", body, null,
      data => {
         if (props) {
            props.setAuthToken(null);
         }
      },
      null
   );
   if (props) {
      props.history.push('/login');
   }


}