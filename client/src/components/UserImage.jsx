import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  let src = `http://localhost:3001/assets/${image}`;

  if (image && image.includes("avatars.githubusercontent.com")) {
      src = image;
  }

  return (
      <Box width={size} height={size}>
          <img
              style={{ objectFit: "cover", borderRadius: "50%" }}
              width={size}
              height={size}
              alt="user"
              src={src}
          />
      </Box>
  );
};

export default UserImage;
