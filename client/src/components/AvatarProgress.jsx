// eslint-disable-next-line react/prop-types
export default function AvatarProgress({ fileUploadError, filePerc }) {
  if (fileUploadError)
    return (
      <p className="text-slate-700 test-sm self-center">
        Error while uploading image
      </p>
    );

  if (filePerc > 0 && filePerc < 100)
    return (
      <p className="text-slate-700 test-sm self-center">
        Uploading {filePerc}%
      </p>
    );

  if (filePerc === 100)
    return (
      <p className="text-green-700 test-sm self-center">
        Image successfully uploaded
      </p>
    );
}
