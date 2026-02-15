import React, { useState, useRef, useLayoutEffect } from "react";
import { Box, IconButton, TextField, Paper, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import { useMessages } from "../context/MessagesContext";

function Chat({ user = {} }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const { sendMessage, setTyping } = useMessages();

  const typingTimeoutRef = useRef(null);

  // ✅ Ref to the actual textarea element
  const inputRef = useRef(null);

  // ✅ This becomes true when the input is visually more than 1 line (wrap OR \n)
  const [isMulti, setIsMulti] = useState(false);

  const isButtonDisabled = !message || message.trim().length === 0;

  // ✅ Detect wrap-based multiline
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight || "0") || 0;

    // If lineHeight can't be read for some reason, fallback to a small threshold
    const threshold = lineHeight ? lineHeight * 1.6 : 28;

    // scrollHeight increases when content wraps / grows
    setIsMulti(el.scrollHeight > threshold);
  }, [message]);

  const handleMessageChange = (event) => {
    const input = event.target.value;

    // Keep your existing regex validation
    const allowedPattern = /^[\p{Script=Greek}\p{Script=Latin}\P{Letter}]*$/u;
    if (!allowedPattern.test(input)) return;

    setMessage(input);

    setTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 3200);
  };

  const handleSend = (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    sendMessage(trimmed);
    setMessage("");
    setTyping(false);
    clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (event) => {
    // Enter sends, Shift+Enter new line
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isButtonDisabled) handleSend(event);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        px: { xs: 1, sm: 2 },
        pb: { xs: 1, sm: 2 },
        pt: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "1000px",
          mx: "auto",
          width: "100%",
          borderRadius: 3,
          p: 1,
          bgcolor: "background.default",
          backdropFilter: "blur(12px)",
        }}
      >
        <Box component="form" onSubmit={handleSend} noValidate autoComplete="off">
          <TextField
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder={t("Type a message...")}
            multiline
            minRows={1}
            maxRows={7}
            fullWidth
            variant="outlined"
            size="small"
            autoFocus
            inputRef={inputRef} // ✅ this points to the textarea when multiline
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: "flex-end", mb: 0 }}>
                  <IconButton
                    type="submit"
                    disabled={isButtonDisabled}
                    sx={{
                      borderRadius: 2,
                      p: 1,
                      mb: 1,
                      transition: "transform 0.15s ease, opacity 0.15s ease",
                      opacity: isButtonDisabled ? 0.45 : 1,
                      "&:hover": {
                        transform: isButtonDisabled ? "none" : "scale(1.06)",
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                // ✅ pill on 1 line, rounded box when it wraps too
                borderRadius: isMulti ? 3 : "999px",
                px: 2,
                alignItems: "flex-end",
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)",
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": {
                  borderColor: (theme) => theme.palette.divider,
                },
                py: 0.25,
              },

              "& .MuiOutlinedInput-inputMultiline": {
                padding: 0,
                lineHeight: 1.4,
                overflowY: "auto",
              },

              "& .MuiOutlinedInput-input": {
                py: 1.15,
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Chat;
