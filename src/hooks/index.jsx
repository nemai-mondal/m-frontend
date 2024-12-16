import { useEffect, useState } from "react";
import { Modal, Fade, Box, Typography, Stack, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Backdrop from "@mui/material/Backdrop";

// Define a custom hook for debouncing
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes before the delay elapses
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useConfirmationModal({
  option = {},
  onConfirm = () => {},
  onClose = () => {},
}) {
  // State variables for modal control
  const [isOpen, setIsOpen] = useState(false); // Modal open/close state
  const [data, setData] = useState(null); // Data to be processed on confirmation

  // Modal option configuration
  const [modalOption, setModalOption] = useState({
    title: "No Title",
    question: "Are you sure you want to delete this permanently?",
    cancelButtonText: "Cancel",
    confirmButtonText: "Confirm",
    confirmButtonColor: "error", // success, error and primary
  });

  // Loading state for confirmation action
  const [loading, setLoading] = useState(false);

  // Function to open the modal with provided data and options
  const openModal = (arg = null) => {
    setData(arg); // Set the data for processing on confirmation

    setIsOpen(true); // Open the modal
  };

  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false); // Close the modal
    setLoading(false); // Reset loading state
    onClose(data); // Call the onClose callback if provided
  };

  // Function to confirm the modal action
  const handleConfirm = () => {
    setLoading(true); // Reset loading state
    onConfirm(data); // Call the onConfirm callback if provided
  };

  useEffect(() => {
    setModalOption((prev) => {
      return { ...prev, ...option };
    });
  }, []);

  // JSX for the modal component
  const component = (
    <Modal
      open={isOpen}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ timeout: 500 }}
    >
      <Fade in={isOpen}>
        <Box className="modalContainer xs delete-modal">
          <Box className="modalBody">
            {/* Modal title */}

            <Typography
              textAlign="center"
              component="h4"
              className="modal-title"
            >
              {modalOption.title}
            </Typography>
            {/* Modal question */}
            <Typography textAlign="center" component="p" className="text">
              {modalOption.question}
            </Typography>
            {/* Buttons for cancel and confirm actions */}
            <Stack spacing={2} direction="row" justifyContent="center">
              {/* Cancel button */}
              <Button
                color="primary"
                variant="outlined"
                size="large"
                fullWidth
                className="text-capitalize"
                onClick={closeModal} // Click handler for cancel action
              >
                {modalOption.cancelButtonText}
              </Button>
              {/* Confirm button with loading state */}
              <LoadingButton
                size="large"
                fullWidth
                variant="contained"
                color={modalOption.confirmButtonColor}
                className="text-capitalize"
                onClick={handleConfirm} // Click handler for confirm action
                loading={loading} // Loading state for the confirm button
              >
                {modalOption.confirmButtonText}
              </LoadingButton>
            </Stack>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );

  // Return modal control functions and JSX for rendering
  return {
    isOpen,
    loading,
    openModal,
    closeModal,
    component,
  };
}
