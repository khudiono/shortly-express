const parseCookies = (req, res, next) => {
  if (!req.headers.cookie) {
    req.cookies = {};
    next();
  } else {
    var cookies = req.headers.cookie.split('; ');
    var obj = {'cookies': {}};
    var parsed = {};
    cookies.forEach((cookie) => {
      var name = cookie.split('=');
      parsed[name[0]] = name[1];
    });
    req.cookies = parsed;
    next();
  }
};

module.exports = parseCookies;