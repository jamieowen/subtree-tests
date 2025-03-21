const processURL = (url) => {
  return url.replace('%CURRENT%', window.location.href);
};

// -----------------------------------------
// TWITTER
// -----------------------------------------
export const twitter = {
  share: ({ text = '', url = '', related = null } = {}) => {
    const t = encodeURIComponent(text);
    const u = encodeURIComponent(processURL(url));
    let open = `http://twitter.com/intent/tweet?text=${t}&url=${u}`;

    if (related) {
      const r = encodeURIComponent(related);
      open += `&related=${r}`;
    }

    if (!window.open(open, 'tweet', 'width=550,height=420,toolbar=no')) {
      // window.location.href = open
    }
  },
  follow: ({ user = '' } = {}) => {
    const u = encodeURIComponent(user);
    const open = `https://twitter.com/intent/user?screen_name=${u}`;

    return window.open(
      open,
      'twitterFollow',
      'width=550,height=420,toolbar=no'
    );
  },
};

// -----------------------------------------
// FACEBOOK
// -----------------------------------------
export const facebook = {
  post: ({ options = {}, callback = () => {} } = {}) => {
    if (!options.method) {
      options.method = 'feed';
    }
    if (window.FB) {
      window.FB.ui(options, callback);
    }
  },
  share: ({ url = '' } = {}) => {
    const u = encodeURIComponent(processURL(url));
    const open = `https://www.facebook.com/sharer.php?u=${u}`;

    return window.open(
      open,
      'facebookShare',
      'width=550,height=420,toolbar=no'
    );
  },
  inviteFriends: (message) => {
    if (window.FB) {
      window.FB.ui({ method: 'apprequests', message });
    }
  },
};

// -----------------------------------------
// WEIBO
// -----------------------------------------
export const weibo = {
  share: ({ text = '', url = window.location.href, img = '' } = {}) => {
    const u = encodeURIComponent(processURL(url));
    const t = encodeURIComponent(text);
    const i = encodeURIComponent(img);
    const open = `http://service.weibo.com/share/share.php?url=${u}&appkey=&title=${t}&pic=${i}&ralateUid=&language=zh_cn`;

    return window.open(
      open,
      'weiboShare',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=550,height=420'
    );
  },
};
