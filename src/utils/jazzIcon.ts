import { ethers } from 'ethers';

export function generateAvatar(address: ethers.utils.BytesLike, size: number) {
  if (!address) return;
  const hash = ethers.utils.keccak256(address); // 对钱包地址进行哈希

  // 创建一个大小为size的Canvas元素
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  // 创建一个渐变色填充背景
  const ctx: any = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `#${hash.slice(3, 5)}${hash.slice(13, 15)}${hash.slice(23, 25)}`);
  gradient.addColorStop(0.5, `#${hash.slice(5, 7)}${hash.slice(15, 17)}${hash.slice(25, 27)}`);
  gradient.addColorStop(1, `#${hash.slice(7, 9)}${hash.slice(17, 19)}${hash.slice(27, 29)}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 返回绘制完成的Canvas元素
  return canvas.toDataURL();
}
