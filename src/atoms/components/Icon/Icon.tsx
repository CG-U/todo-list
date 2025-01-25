export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  iconName: "menu" | "delete" | "chevron_left" | "chevron_right";
}

export function Icon(props: IconProps) {
  const { iconName, ...spanProp } = props;
  return (
    <span {...spanProp} className={`material-icons ${spanProp.className}`}>
      {iconName}
    </span>
  );
}
