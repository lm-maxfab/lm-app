export const placeholderImagesUrl = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/440px-Image_created_with_a_mobile_phone.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/TEIDE.JPG/440px-TEIDE.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Pencil_drawing_of_a_girl_in_ecstasy.jpg/440px-Pencil_drawing_of_a_girl_in_ecstasy.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Coord_planes_color.svg/440px-Coord_planes_color.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Stereographic_projection_in_3D.svg/440px-Stereographic_projection_in_3D.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Sphere_wireframe_10deg_6r.svg/440px-Sphere_wireframe_10deg_6r.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Mairead_cropped.png/500px-Mairead_cropped.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/ERP_-_optic_cabling.jpg/600px-ERP_-_optic_cabling.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Cajal_Retina.jpg/440px-Cajal_Retina.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bubonic_plague-en.svg/480px-Bubonic_plague-en.svg.png',
]

export default function getPlaceholderImageUrl () {
  const pos = Math.floor(Math.random() * placeholderImagesUrl.length)
  const url = placeholderImagesUrl[pos]
  return url
}
