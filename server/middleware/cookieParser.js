const parseCookies = (req, res, next) => {
  if (!req.headers.cookie) {
    next();
  } else if (req.headers.cookie) {
    var cookies = req.headers.cookie.split('; ');
    var obj = {'cookies': {}};
    cookies.forEach((cookie) => {
      var name = cookie.split('=');
      req.cookies[name[0]] = name[1];
    });
    next();
  }
};

module.exports = parseCookies;