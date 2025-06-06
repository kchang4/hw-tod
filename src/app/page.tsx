import { Box, Stack } from "@mui/material"
import { Suspense } from "react"
import SideMenu from "./components/side-menu"
import TodList from "./tod-list"
import { SessionProvider } from "next-auth/react"
import TopNavBar from "./components/top-navbar"
import { TimeSettingsProvider } from "./contexts/time-settings.context"
import HWYellList from "./hw-yell-list"
import { Nations } from "./types"

export default function Home() {

  return (
    <TimeSettingsProvider>
      <SessionProvider>
        <Box sx={{ height: '100%', width: '100%' }}>
          <TopNavBar />
          <Stack direction="row" spacing={2} sx={{ height: '100%', width: '100%' }}>
            {/* <SideMenu /> */}
            <Box flexGrow={1}>
              <Suspense fallback="Loading TODs...">
                {/* <TodList /> */}
                <HWYellList />
              </Suspense>
            </Box>
          </Stack >
        </Box >
      </SessionProvider>
    </TimeSettingsProvider>

  )
}
