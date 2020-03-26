
import cookie from 'react-cookies'
import API from './helpers/api.js'

const Auth = {
  _isAuthenticated: false,

  authenticate(name, pass, cb) {
    this._isAuthenticated = true;
 

    API.create("/login", {
      username : name,
      passwd : pass,
    })
      .then(res => {
        console.log('res :', res);
        
        var userId = '';
        if (res.result) {
          userId = res.data.id;
          cookie.save('userId', res.data.id, { path: '/' })
        }

        setTimeout(
          () =>
            cb({
              userId: userId
            }),
          100
        );
      })
      .catch(err => console.log(err));
  },

  signout(cb) {
    this._isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

export default Auth;
