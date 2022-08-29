export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  isUse: boolean;
}

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  images: AlbumArt[];
}

export interface AlbumArt {
  height: number;
  url: string;
  width: number;
}
