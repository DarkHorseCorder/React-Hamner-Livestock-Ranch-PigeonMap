export default function isDeepEqual(item1, item2) {
  let equality = false;

  if (item1 === item2) return true;
  if (item1 === null || item2 === null) return false;
  if (typeof item1 !== typeof item2) return false;

  if (typeof item1 === "object" && typeof item2 === "object") {
    // Array- Check first since all arrays type as objects
    if (Array.isArray(item1) && Array.isArray(item2)) {
      if (item1.length !== item2.length) return false;

      for (let i in item1) {
        equality = isDeepEqual(item1[i], item2[i]);
      }
    } else {
      // Object
      const item1Keys = Object.keys(item1);
      const item2Keys = Object.keys(item2);

      // Length
      if (item1Keys.length !== item2Keys.length) return false;

      item1Keys.forEach((item) => {
        const isEqual = isDeepEqual(item1[item], item2[item]);

        if (!item2Keys.includes(item) || !isEqual) return false;
        else {
          equality = isEqual;
        }
      });
    }
  }

  return equality;
}
