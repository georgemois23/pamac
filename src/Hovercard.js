"use client"

import { Box, Link, Strong } from "@chakra-ui/react"
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "./components/ui/hover-card"
import { useState } from "react"
import { hover } from "@testing-library/user-event/dist/hover"

function Hovercard({name}) {
  const [open, setOpen] = useState(false)
  return (
    <HoverCardRoot size="sm" open={open} onOpenChange={(e) => setOpen(e.open)} >
      <HoverCardTrigger asChild>
        <p>{name}</p>
      </HoverCardTrigger>
      <HoverCardContent maxWidth="240px" backgroundColor='black'>
        <HoverCardArrow />
        <Box backgroundColor={'black'} >
           <a backgroundColor='black' href="https://moysiadis.codes/" target="_blank" color="red">Visit my portfolio</a> 
        </Box>
      </HoverCardContent>
    </HoverCardRoot>
  )
}

export default Hovercard;