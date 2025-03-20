import { Drawer as AntDrawer, Button } from "antd";
import { useAuth } from "../context/Context";
import { CloseOutlined } from "@ant-design/icons";

function CustomDrawer() {
  const { open, setOpen, username, clearAuth } = useAuth();

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AntDrawer
        title={`Welcome ${username} !`}
        placement="right"
        onClose={onClose}
        open={open}
        destroyOnClose
        maskClosable
        closeIcon={<CloseOutlined />}
      >
        <div className="flex flex-col items-start gap-3">
          <a
            onClick={() => {
              window.location.replace("/profile");
              setOpen(false);
            }}
            // style={{ color: "black" }}
            className="mr-4  text-md font-semibold !text-black  hover:underline"
          >
            Profile
          </a>
          <a
            onClick={() => {
              window.location.replace("/uploaded-papers");
              setOpen(false);
            }}
            className="mr-4 text-md font-semibold !text-black hover:underline"
          >
            Uploaded Papers
          </a>
          <p
            onClick={() => {
              window.location.replace("/bookmarked-papers");
              setOpen(false);
            }}
            className="mr-4  text-md font-semibold !text-black hover:underline cursor-pointer"
          >
            Bookmarked Papers
          </p>
          <Button
            onClick={() => {
              clearAuth();
              window.location.replace("/");
            }}
            type="primary"
          >
            Logout
          </Button>
        </div>
      </AntDrawer>
    </>
  );
}

export default CustomDrawer;
