export default function ActiveBadge(props) {
  return (
    <div className={props.active === true ? "badge badge-active" : "badge"}>
      {props.active === true ? "True" : "False"}
    </div>
  );
}
