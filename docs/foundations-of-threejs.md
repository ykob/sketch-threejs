# Three.js 学習メモ

主に「[HTML5による物理シミュレーション 著：遠藤 理平](http://goo.gl/krKKTV)」の覚書です。

## レンダラー（Renderer）とシーン（Scene）

Three.jsでは*レンダラーオブジェクト*と*シーンオブジェクト*を生成して利用する。

- [THREE.WebGLRenderer(param)](http://threejs.org/docs/#Reference/Renderers/WebGLRenderer)
- [THREE.Scene()](http://threejs.org/docs/#Reference/Scenes/Scene)

### Three.jsにおける「レンダラー」

仮想的な3次元空間における物体を、2次元平面のディスプレイに適切に描画するための流れを指す。  
実際に描画することを*レンダリング*と呼ぶ。

### 2種類のカメラ

コンピュータ上の仮想の3次元空間からどのように2次元平面に射影するかを指定するのが*カメラ*。  
Three.jsでは*透視投影*と*正投影*の2つの方法でカメラを設定することができる。

#### [透視投影](http://ja.wikipedia.org/wiki/%E9%80%8F%E8%A6%96%E6%8A%95%E5%BD%B1)

視点から手前の物体を大きく、遠くの物体を小さく描画し、遠近感を生み出す方式。  
これは通常生活における物の見え方と同じ。

- [THREE.PerspectiveCamera(fov, aspect, near, far)](http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera)

#### [正投影](http://ja.wikipedia.org/wiki/%E6%AD%A3%E6%8A%95%E5%BD%B1%E5%9B%B3)

物体の見た目の大きさを、視点からの距離によらず描画する方式。

- [THREE.OrthographicCamera(left, right, top, bottom, near, far)](http://threejs.org/docs/#Reference/Cameras/OrthographicCamera)

## 3次元オブジェクトの描画

仮想3次元空間のオブジェクトを2次元平面のディスプレイに表示する際に、単に射影するだけでは立体感は生まれない。  
立体感を出すための手法が*シェーディング*（陰影付け）。  
シェーディングは、光源からの光線ベクトルや、オブジェクトの面の法線ベクトルを利用した演算を行う必要がある。

### 光源の設置

Three.jsでは、*点光源*、*スポット光源*、*平行光源*、*環境光*がそれぞれ独立して用意されている。

#### 平行光源（無限遠光源）

無限の彼方にある点光源から照射される光を生成する。  
光の照射角が物体の位置座標に因らない。  

- [THREE.DirectionalLight(hex, intensity)](http://threejs.org/docs/#Reference/Lights/DirectionalLight)

#### 点光源

方向性を持たない比較的小さな光源。局所的に空間を照らす。  
光源からの距離が離れると光強度が低下する．

- [THREE.PointLight(hex, intensity, distance)](http://threejs.org/docs/#Reference/Lights/PointLight)

#### スポット光源

方向性を持った点光源。  
光源に加えて、光軸の方向、広がり角度、及び光軸から半径方向の光量分布を指定する。

- [THREE.SpotLight(hex, intensity, distance, angle, exponent)](http://threejs.org/docs/#Reference/Lights/SpotLight)

#### 

- [THREE.HemisphereLight()]()

#### 環境光

空気による散乱や、周囲の物体との相互反射によって生じる間接光源。

- [THREE.AmbientLight(hex)](http://threejs.org/docs/#Reference/Lights/AmbientLight)


---

- [THREE.AxisHelper()](http://threejs.org/docs/#Reference/Extras.Helpers/AxisHelper)

