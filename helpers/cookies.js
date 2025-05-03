function getCookie(req, name) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const cookie = cookies
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));

  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie.split("=")[1]));
  } catch {
    return null;
  }
}

function setCookie(res, name, value) {
  const encodedValue = encodeURIComponent(JSON.stringify(value));
  let cookie = `${name}=${encodedValue}`;
  cookie += `; Max-Age=${31536000}`; // 1 year
  cookie += `; Path=/`;
  res.setHeader("Set-Cookie", cookie);
}

module.exports.getCookie = getCookie;
module.exports.setCookie = setCookie;
