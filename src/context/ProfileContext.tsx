import React, { createContext, useState, useContext } from 'react';

export interface Address {
  houseNo?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
}


export interface ImageType {
  path?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  address: Address;
  image: ImageType;
}

interface ProfileContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  phoneNumber: '',
  address: {
    houseNo: '',
    street: '',
    postalCode: '',
    city: '',
    state: '',
  },
  image: { path: '' },
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  setProfile: () => {},
});

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
