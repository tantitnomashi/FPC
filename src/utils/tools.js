const formatNumber = (num) => numberWithCommas(Math.floor(num*100)/100);

const numberWithCommas = (x) => {
  if (!x) return 0;
  x = Math.floor(x*100)/100;
  let addVal = '';
  if (x > 1000000000) {
    addVal = 'B';
    if (Math.floor(x/1000000000) < 1000) {
      x = Math.floor((x/1000000000)*100)/100;
    } else {
      x = Math.floor(x/1000000000);
    }
  } else if (x > 1000000) {
    addVal = 'M';
    if (Math.floor(x/1000000) < 1000) {
      x = Math.floor((x/1000000)*100)/100;
    } else {
      x = Math.floor(x/1000000);
    }
  } else if (x > 1000) {
    addVal = 'k';
    if (Math.floor(x/1000) < 1000) {
      x = Math.floor((x/1000)*100)/100;
    } else {
      x = Math.floor(x/1000);
    }
  } 
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + addVal
};

const getPostId = (e) => {
  var t = "",
  s = e.match(/[^](fbid=[0-9]{9})\d+/);
  if (null !== s) t = (t = s[0].replace("?fbid=", "")).replace("_fbid=", "");
  else {
    var o = e.match(/[^\/|\.!=][0-9]{7,}(?!.*[0-9]{7,})\d+/);
    null !== o && (t = o[0])
  }
  return t
}

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isValidHttpUrl = (string) => {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

module.exports ={ formatNumber, getPostId, isMobile, isValidHttpUrl };