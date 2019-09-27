
import "./icons.scss";

function requireAll(r) {
  r.keys().forEach(r);
}

requireAll(require.context('./icons/temp/', true, /\.svg$/));