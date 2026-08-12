import { AnimatePresence, motion } from "framer-motion";
import ModalCloseButton from "./ModalCloseButton";
import { modalBackdrop, modalPanel } from "../../libs/motion";

const ContentModal = ({
  open,
  onClose,
  children,
  maxWidth = "max-w-2xl",
  showClose = true,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...modalBackdrop}
          onClick={onClose}
          className="modal-overlay"
        >
          <motion.div
            {...modalPanel}
            onClick={(e) => e.stopPropagation()}
            className={`modal-panel ${maxWidth}`}
          >
            {showClose && <ModalCloseButton onClick={onClose} />}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;
