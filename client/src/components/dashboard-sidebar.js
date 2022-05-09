import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Selector as SelectorIcon } from "../icons/selector";
import { Users as UsersIcon } from "../icons/users";
import { XCircle as XCircleIcon } from "../icons/x-circle";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";

const items = [
  {
    href: "/node1",
    icon: <ChartBarIcon fontSize="small" />,
    title: "node1",
  },
  {
    href: "/node2",
    icon: <ChartBarIcon fontSize="small" />,
    title: "node2",
  },
  {
    href: "/node3",
    icon: <ChartBarIcon fontSize="small" />,
    title: "node3",
  },
  {
    href: "/404",
    icon: <XCircleIcon fontSize="small" />,
    title: "Error",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href="/" passHref>
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42,
                  }}
                />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                px: 3,
                py: "11px",
                borderRadius: 1,
              }}
            >
              <div>
                <Typography color="inherit" variant="subtitle1">
                  현재 접속노드
                </Typography>
                <Typography color="neutral.400" variant="body2">
                  Your tier : node1번
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: "neutral.500",
                  width: 14,
                  height: 14,
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 3,
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
        <Divider sx={{ borderColor: "#2D3748" }} />
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <Typography color="neutral.100" variant="subtitle2">
            팀프로젝트 : 김동욱 이동녘
          </Typography>
          <Typography color="neutral.500" variant="body2">
            2주 블록체인 첫프로젝트
          </Typography>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              mx: "auto",
              width: "160px",
              "& img": {
                width: "100%",
              },
            }}
          >
            <img alt="Go to pro" src="/static/images/sidebar_pro.png" />
          </Box>
          <NextLink href="https://github.com/pier101/PROJECT_BlockExplorer" passHref>
            <Button
              color="secondary"
              component="a"
              endIcon={<OpenInNewIcon />}
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
            >
              상세코드 Git링크
            </Button>
          </NextLink>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
