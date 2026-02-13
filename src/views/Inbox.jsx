import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Conversations from "../components/Conversations";
import PreviewMsg from "./PreviewMsg";

export default function Inbox() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 910);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 910);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ On mobile we don't render split view; routes handle it
  if (isMobile) return <Conversations isMobile={true} />;

  return (
    <Box
  sx={{
    display: 'flex',
    width: '100%',
    height: "100dvh",  
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
    bgcolor: 'inherit',
    position: 'relative',
  }}
>

      <Box sx={{ width: 330, flexShrink: 0, borderRight: "1px solid", borderColor: "divider" }}>
        <Conversations isMobile={false} onSelectConversation={setSelectedId} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0, height: '100dvh', overflow: 'hidden' }}>
        {selectedId ? (
          <PreviewMsg forcedConversationId={selectedId} onClose={() => setSelectedId(null)} />
        ) : (
          <Box sx={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
            Select a conversation
          </Box>
        )}
      </Box>
    </Box>
  );
}
