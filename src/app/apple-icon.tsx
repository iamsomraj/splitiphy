import { BrandMark } from '@/components/shared/brand-mark';
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<BrandMark size={180} rounded={false} />, size);
}
