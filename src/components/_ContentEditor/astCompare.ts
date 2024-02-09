const match = (userAns: any, ans: any) => {
  if (typeof userAns !== typeof ans) return false;
  if (Array.isArray(ans)) {
    if (!Array.isArray(userAns) || ans.length > userAns.length) return false;
    let remaining = userAns.length;
    for (let i = 0; i < ans.length; i++) {
      while (!match(userAns[userAns.length - remaining], ans[i]) && remaining > 0) {
        remaining--;
      }
      if (remaining === 0) return false;
      remaining--;
    }
  } else if (typeof ans === "object") {
    if (Array.isArray(userAns)) return false;
    for (const i in ans) {
      if (!Object.prototype.hasOwnProperty.call(userAns, i)) return false;
      if (!match(userAns[i], ans[i])) return false;
    }
  } else if (userAns !== ans) return false;
  return true;
};

export default match;
