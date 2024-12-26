import { fetchTods } from "./actions"
import { Box, Stack } from "@mui/material"
import { Suspense } from "react"
import SideMenu from "./side-menu"

export default async function Home() {
  // grab tods from the last 6hrs
  const tods = await fetchTods()

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ height: '100%', width: '100%' }}>
        <SideMenu />
        <Box>
          <Suspense fallback="Loading TODs...">
            Hello...
          </Suspense>
        </Box>
      </Stack >
    </Box >
  )
}
