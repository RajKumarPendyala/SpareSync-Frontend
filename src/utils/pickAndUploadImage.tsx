import { launchImageLibrary } from 'react-native-image-picker';

const CLOUD_NAME = 'dxcbw424l';
const UPLOAD_PRESET = 'PartNest';

const pickAndUploadImage = async (): Promise<string | null> => {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (result.didCancel || !result.assets?.[0]){
    return null;
  }

  const image = result.assets[0];

  const data = new FormData();
  data.append('file', {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  } as any);
  data.append('upload_preset', UPLOAD_PRESET);
  data.append('cloud_name', CLOUD_NAME);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data,
    });

    const json = await res.json();
    console.log(json.secure_url);

    return json.secure_url;
  } catch (err) {
    console.error('Upload failed', err);
    return null;
  }
};

export default pickAndUploadImage;
