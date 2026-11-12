import * as THREE from 'three';
import * as xb from 'xrblocks';
import { state } from '../state.ts';

export class CatScene extends xb.Script {
  private catGroup?: THREE.Group;
  private headMesh?: THREE.Mesh;
  private leftEar?: THREE.Mesh;
  private rightEar?: THREE.Mesh;
  private collarBell?: THREE.Mesh;
  private pedestal?: THREE.Mesh;
  private time: number = 0;

  init() {
    // Ambient & Directional Lights
    this.add(new THREE.HemisphereLight(0xfff7ed, 0x1e293b, 2.5));
    const dirLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    dirLight.position.set(1.5, 3.5, 2);
    this.add(dirLight);

    // Build Cat Mascot
    this.catGroup = new THREE.Group();
    this.catGroup.position.set(0, xb.user.height - 0.25, -1.3);

    // Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.08, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    this.pedestal.position.y = -0.35;
    this.catGroup.add(this.pedestal);

    // Golden Ring on Pedestal
    const ringGeo = new THREE.TorusGeometry(0.35, 0.015, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.31;
    this.catGroup.add(ring);

    // Cat Body
    const bodyGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.32, 24);
    const catFurMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7, // pure white fluffy fur
      roughness: 0.8,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, catFurMat);
    bodyMesh.position.y = -0.15;
    this.catGroup.add(bodyMesh);

    // Cat Head
    const headGeo = new THREE.SphereGeometry(0.16, 32, 24);
    this.headMesh = new THREE.Mesh(headGeo, catFurMat);
    this.headMesh.position.y = 0.1;
    this.catGroup.add(this.headMesh);

    // Ears
    const earGeo = new THREE.ConeGeometry(0.06, 0.12, 16);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0xfde047, // gentle cream amber ear tips
      roughness: 0.6,
    });
    this.leftEar = new THREE.Mesh(earGeo, earMat);
    this.leftEar.position.set(-0.09, 0.23, 0.02);
    this.leftEar.rotation.z = 0.35;
    this.catGroup.add(this.leftEar);

    this.rightEar = new THREE.Mesh(earGeo, earMat);
    this.rightEar.position.set(0.09, 0.23, 0.02);
    this.rightEar.rotation.z = -0.35;
    this.catGroup.add(this.rightEar);

    // Inner Ears (Pink)
    const innerEarGeo = new THREE.ConeGeometry(0.04, 0.09, 16);
    const innerEarMat = new THREE.MeshStandardMaterial({ color: 0xfda4af });
    const innerLeftEar = new THREE.Mesh(innerEarGeo, innerEarMat);
    innerLeftEar.position.set(-0.09, 0.23, 0.035);
    innerLeftEar.rotation.z = 0.35;
    this.catGroup.add(innerLeftEar);

    const innerRightEar = new THREE.Mesh(innerEarGeo, innerEarMat);
    innerRightEar.position.set(0.09, 0.23, 0.035);
    innerRightEar.rotation.z = -0.35;
    this.catGroup.add(innerRightEar);

    // Cat Eyes (Amber / Emerald)
    const eyeGeo = new THREE.SphereGeometry(0.032, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.1,
      metalness: 0.5,
    });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.06, 0.12, 0.135);
    this.catGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.06, 0.12, 0.135);
    this.catGroup.add(rightEye);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.016, 12, 12);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.06, 0.12, 0.155);
    this.catGroup.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.06, 0.12, 0.155);
    this.catGroup.add(rightPupil);

    // Cute Nose
    const noseGeo = new THREE.ConeGeometry(0.018, 0.02, 12);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.x = Math.PI;
    nose.position.set(0, 0.07, 0.16);
    this.catGroup.add(nose);

    // Collar & Golden Bell
    const collarGeo = new THREE.TorusGeometry(0.15, 0.018, 16, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = -0.01;
    this.catGroup.add(collar);

    const bellGeo = new THREE.SphereGeometry(0.028, 16, 16);
    const bellMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.9,
    });
    this.collarBell = new THREE.Mesh(bellGeo, bellMat);
    this.collarBell.position.set(0, -0.025, 0.16);
    this.catGroup.add(this.collarBell);

    // Tail
    const tailGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.28, 16);
    const tail = new THREE.Mesh(tailGeo, catFurMat);
    tail.position.set(0, -0.15, -0.18);
    tail.rotation.x = -0.6;
    this.catGroup.add(tail);

    this.add(this.catGroup);

    // Spatial UI Info Card using XR Blocks built-in UICard
    this.buildSpatialCard();
  }

  private buildSpatialCard() {
    const matingPets = state.getFilteredMatingPets();
    const primaryPet = state.getPrimaryUserMatingPet();

    const title = new xb.UIText({
      text: 'Meow - مواء',
      style: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', color: '#f59e0b' },
    });

    const subtitle = new xb.UIText({
      text: 'منصة تزاوج وتبني الحيوانات الأليفة في الواقع المعزز',
      style: { fontSize: 13, textAlign: 'center', opacity: 0.8 },
    });

    const statsText = new xb.UIText({
      text: `🐱 ${matingPets.length} قطط متاحة للتزاوج | ${primaryPet ? `قطك: ${primaryPet.name}` : ''}`,
      style: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: '#10b981' },
    });

    const statusButton = new xb.UIButton({
      label: 'التفاعل مع القطة 🐾',
      style: { width: '100%', height: 40 },
      onClick: () => {
        if (this.catGroup) {
          this.catGroup.scale.setScalar(1.2);
          setTimeout(() => this.catGroup?.scale.setScalar(1.0), 300);
        }
      },
    });

    const card = new xb.UICard({
      size: { width: 0.52, height: 'auto' },
      manipulation: true,
      edge: true,
      style: { flexDirection: 'column', gap: 12, padding: 18 },
      children: [title, subtitle, statsText, statusButton],
    });

    card.position.set(0.65, xb.user.height - 0.1, -1.25);
    card.rotation.y = -0.3;
    this.add(card);
  }

  update() {
    const dt = xb.getDeltaTime();
    this.time += dt;

    if (this.catGroup) {
      // Gentle floating & idle rotation
      this.catGroup.rotation.y = Math.sin(this.time * 0.5) * 0.15;
      this.catGroup.position.y = (xb.user.height - 0.25) + Math.sin(this.time * 2.0) * 0.015;
    }

    if (this.headMesh) {
      this.headMesh.rotation.z = Math.sin(this.time * 1.5) * 0.05;
      this.headMesh.rotation.x = Math.sin(this.time * 2.2) * 0.03;
    }

    if (this.collarBell) {
      this.collarBell.rotation.y += 0.03;
    }
  }

  onSelectEnd(event: xb.SelectEvent) {
    if (this.catGroup) {
      this.catGroup.scale.setScalar(1.15);
      setTimeout(() => this.catGroup?.scale.setScalar(1.0), 200);
    }
  }
}
