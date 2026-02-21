import styles from "./tooltip.module.css";

// Information needed to build the tooltip

export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className={styles.tooltip}
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      {interactionData.name}
    </div>
  );
};
