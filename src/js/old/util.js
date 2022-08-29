import * as THREE from 'three'

export const getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export const getDegree = function (radian) {
  return (radian / Math.PI) * 180
}

export const getRadian = function (degrees) {
  return (degrees * Math.PI) / 180
}
export const getPolarCoord = function (rad1, rad2, r) {
  var x = Math.cos(rad1) * Math.cos(rad2) * r
  var z = Math.cos(rad1) * Math.sin(rad2) * r
  var y = Math.sin(rad1) * r
  return new THREE.Vector3(x, y, z)
}
