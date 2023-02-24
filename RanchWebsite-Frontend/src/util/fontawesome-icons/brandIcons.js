import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const brandIcons = () => {
  return library.add(faFacebook, faInstagram, faTwitter, faLinkedin);
};

export default brandIcons;
