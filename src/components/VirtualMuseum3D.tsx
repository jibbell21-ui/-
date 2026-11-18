import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ArrowUpRight,
  Disc3,
  Move3d,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

export interface Museum3DZone {
  id: string;
  label: string;
  labelEn: string;
  title: string;
  titleEn: string;
  yearBE: string;
  yearEn: string;
  description: string;
  descriptionEn: string;
  archiveId: string;
  vinylTrackId?: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
}

export const MUSEUM_3D_ZONES: Museum3DZone[] = [
  {
    id: 'overview',
    label: 'ภาพรวมโถงกลาง',
    labelEn: 'Overview',
    title: 'โถงจัดแสดงประวัติศาสตร์การสื่อสารไทย',
    titleEn: 'Thai Broadcasting Heritage Hall',
    yearBE: 'พ.ศ. 2476–ปัจจุบัน',
    yearEn: '1933–Present',
    description:
      'ลากเมาส์หรือใช้นิ้วสัมผัสเพื่อหมุนชมรอบห้องจัดแสดง 3 มิติ คลิกที่แท่นวัตถุจัดแสดงแต่ละชิ้นเพื่อซูมเข้าดูรายละเอียด',
    descriptionEn:
      'Drag or swipe to orbit around the 3D gallery. Click any exhibit pedestal to focus and read its archival record.',
    archiveId: 'arc-2540-digital-archive',
    cameraPos: [0, 4.6, 10.8],
    targetPos: [0, 1.3, -0.4],
  },
  {
    id: 'radio',
    label: 'วิทยุกระจายเสียง',
    labelEn: 'Early Radio',
    title: 'ไมโครโฟนริบบอนและเครื่องส่งวิทยุยุคแรก',
    titleEn: 'Pioneer Ribbon Microphone & Radio Transmitter',
    yearBE: 'พ.ศ. 2483',
    yearEn: '1940 (B.E. 2483)',
    description:
      'แท่นจัดแสดงชุดอุปกรณ์ห้องส่งสถานีวิทยุกระจายเสียงแห่งประเทศไทย ประกอบด้วยไมโครโฟนริบบอนโครเมียมและเครื่องส่งหลอดสุญญากาศ',
    descriptionEn:
      'Original studio velocity ribbon microphone and vacuum-tube transmitter console from Radio Thailand’s early broadcast room.',
    archiveId: 'arc-2483-microphone',
    cameraPos: [-3.4, 2.35, 3.2],
    targetPos: [-3.2, 1.45, -0.8],
  },
  {
    id: 'turntable',
    label: 'เครื่องเล่นแผ่นเสียง',
    labelEn: 'Phonograph',
    title: 'แท่นเครื่องเล่นแผ่นเสียงครั่งและไวนิลประวัติศาสตร์',
    titleEn: 'Historical Shellac & Vinyl Gramophone Stand',
    yearBE: 'พ.ศ. 2482–2495',
    yearEn: '1939–1952',
    description:
      'เครื่องเล่นแผ่นเสียงตู้ไม้สักทองพร้อมลำโพงปากแตรทองเหลืองและจานหมุน 78/33⅓ รอบ สำหรับถ่ายทอดเสียงประวัติศาสตร์',
    descriptionEn:
      'Teak-plinth archival turntable with spun brass acoustic horn and 78/33⅓ RPM platter synchronized with the live audio deck.',
    archiveId: 'arc-2482-shellac',
    vinylTrackId: 'hsp-2482',
    cameraPos: [0.3, 2.5, 3.4],
    targetPos: [0, 1.45, 0.3],
  },
  {
    id: 'tv4',
    label: 'โทรทัศน์ช่อง 4',
    labelEn: 'Channel 4 TV',
    title: 'กล้องโทรทัศน์และจอภาพ ช่อง 4 บางขุนพรหม',
    titleEn: 'Channel 4 Bang Khun Phrom TV Camera & CRT Monitor',
    yearBE: 'พ.ศ. 2498',
    yearEn: '1955 (B.E. 2498)',
    description:
      'กล้องส่งโทรทัศน์ระบบขาว-ดำ Image Orthicon บนแท่นล้อเลื่อน และจอรับภาพ CRT แสดงสัญญาณ Test Card ยุคบุกเบิก',
    descriptionEn:
      '1955 Image Orthicon monochrome television camera on rolling dolly beside a vintage wooden CRT control monitor.',
    archiveId: 'arc-2498-tv4',
    cameraPos: [3.6, 2.4, 3.3],
    targetPos: [3.2, 1.5, -0.8],
  },
  {
    id: 'vitrine',
    label: 'ตู้จดหมายเหตุ',
    labelEn: 'Archive Vitrine',
    title: 'ตู้กระจกจัดแสดงประกาศตั้งสำนักงานโฆษณาการ',
    titleEn: '1933 Founding Proclamation Display Vitrine',
    yearBE: 'พ.ศ. 2476',
    yearEn: '1933 (B.E. 2476)',
    description:
      'เอกสารราชการต้นฉบับและสมุดบันทึกการออกอากาศที่เก็บรักษาในตู้กระจกควบคุมความชื้น',
    descriptionEn:
      'Climate-controlled glass vitrine safeguarding the original 1933 Publicity Bureau charter and broadcast logbooks.',
    archiveId: 'arc-2476-founding',
    cameraPos: [0.2, 2.25, -1.3],
    targetPos: [0, 1.35, -3.7],
  },
];

interface VirtualMuseum3DProps {
  lang: Language;
  activeZoneId: string;
  isAudioPlaying: boolean;
  onSelectZone: (zoneId: string) => void;
  onOpenArchiveItem: (archiveId: string) => void;
  onPlayVinyl: (vinylTrackId: string) => void;
}

const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _mouse = new THREE.Vector2();

function createCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  maxAnisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export const VirtualMuseum3D: React.FC<VirtualMuseum3DProps> = ({
  lang,
  activeZoneId,
  isAudioPlaying,
  onSelectZone,
  onOpenArchiveItem,
  onPlayVinyl,
}) => {
  const t = TRANSLATIONS[lang].museum3d;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const activeZoneRef = useRef<string>(activeZoneId);
  const isAudioPlayingRef = useRef<boolean>(isAudioPlaying);
  const onSelectZoneRef = useRef(onSelectZone);
  const transitionActiveRef = useRef<boolean>(false);

  useEffect(() => {
    activeZoneRef.current = activeZoneId;
    const zone = MUSEUM_3D_ZONES.find((z) => z.id === activeZoneId) ?? MUSEUM_3D_ZONES[0];
    _targetCamPos.set(...zone.cameraPos);
    _targetLookAt.set(...zone.targetPos);
    transitionActiveRef.current = true;
  }, [activeZoneId]);

  useEffect(() => {
    isAudioPlayingRef.current = isAudioPlaying;
  }, [isAudioPlaying]);

  useEffect(() => {
    onSelectZoneRef.current = onSelectZone;
  }, [onSelectZone]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 560;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const bgHex = 0xe9e4da;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.026);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    const initialZone =
      MUSEUM_3D_ZONES.find((z) => z.id === activeZoneRef.current) ?? MUSEUM_3D_ZONES[0];
    camera.position.set(...initialZone.cameraPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialZone.targetPos);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.8;
    controls.maxDistance = 14.5;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.enablePan = true;
    controls.update();

    const onControlStart = () => {
      transitionActiveRef.current = false;
    };
    controls.addEventListener('start', onControlStart);

    const hemiLight = new THREE.HemisphereLight(0xdfe8f5, 0x8b7e6d, 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.85);
    keyLight.position.set(5.5, 9.5, 6.0);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    const d = 8.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 26;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcbd9f0, 0.75);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);

    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(res: T): T => {
      disposables.push(res);
      return res;
    };

    const marbleFloorTex = createCanvasTexture(
      512,
      512,
      (ctx, w, h) => {
        ctx.fillStyle = '#E5DFD3';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#CFC7B8';
        ctx.lineWidth = 2;
        for (let i = 0; i <= 4; i++) {
          const p = (i * w) / 4;
          ctx.beginPath();
          ctx.moveTo(p, 0);
          ctx.lineTo(p, h);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, p);
          ctx.lineTo(w, p);
          ctx.stroke();
        }
      },
      maxAniso
    );
    marbleFloorTex.wrapS = THREE.RepeatWrapping;
    marbleFloorTex.wrapT = THREE.RepeatWrapping;
    marbleFloorTex.repeat.set(8, 8);
    track(marbleFloorTex);

    const floorMat = track(
      new THREE.MeshStandardMaterial({ map: marbleFloorTex, roughness: 0.32, metalness: 0.04 })
    );
    const wallMat = track(new THREE.MeshStandardMaterial({ color: 0xf4f0e8, roughness: 0.88 }));
    const teakMat = track(
      new THREE.MeshStandardMaterial({ color: 0x4a2f1d, roughness: 0.45, metalness: 0.08 })
    );
    const limestonePedestalMat = track(
      new THREE.MeshStandardMaterial({ color: 0xd8d2c7, roughness: 0.62, metalness: 0.02 })
    );
    const brassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xc89d42,
        metalness: 0.92,
        roughness: 0.2,
        anisotropy: 0.7,
      })
    );
    const chromeMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xe6e8eb,
        metalness: 0.95,
        roughness: 0.14,
        anisotropy: 0.8,
      })
    );
    const darkBakeliteMat = track(
      new THREE.MeshStandardMaterial({ color: 0x1c1a18, roughness: 0.32, metalness: 0.12 })
    );
    const glassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf5f9fc,
        metalness: 0,
        roughness: 0.06,
        transmission: isSoftwareGl ? 0 : 0.92,
        transparent: true,
        opacity: isSoftwareGl ? 0.32 : 1,
        ior: 1.52,
        thickness: 0.15,
        depthWrite: false,
      })
    );

    const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(24, 22)), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const backWall = new THREE.Mesh(track(new THREE.BoxGeometry(20, 6.2, 0.3)), wallMat);
    backWall.position.set(0, 3.1, -5.8);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(track(new THREE.BoxGeometry(0.3, 6.2, 16)), wallMat);
    leftWall.position.set(-7.5, 3.1, 1.5);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(track(new THREE.BoxGeometry(0.3, 6.2, 16)), wallMat);
    rightWall.position.set(7.5, 3.1, 1.5);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const louverGeo = track(new THREE.BoxGeometry(14.6, 0.16, 0.14));
    const louverCount = 24;
    const louverMesh = new THREE.InstancedMesh(louverGeo, teakMat, louverCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < louverCount; i++) {
      dummy.position.set(0, 5.7, -5.2 + i * 0.56);
      dummy.updateMatrix();
      louverMesh.setMatrixAt(i, dummy.matrix);
    }
    louverMesh.instanceMatrix.needsUpdate = true;
    louverMesh.computeBoundingSphere();
    scene.add(louverMesh);

    const wallBannerTex = createCanvasTexture(
      1024,
      320,
      (ctx, w, h) => {
        ctx.fillStyle = '#1E3A8A';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 6;
        ctx.strokeRect(18, 18, w - 36, h - 36);
        ctx.fillStyle = '#F8F7F4';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('พิพิธภัณฑ์และหอจดหมายเหตุกรมประชาสัมพันธ์', w / 2, 136);
        ctx.fillStyle = '#E5D3A3';
        ctx.font = '24px monospace';
        ctx.fillText('PRD MUSEUM & NATIONAL BROADCASTING ARCHIVES · EST. 1933', w / 2, 206);
      },
      maxAniso
    );
    track(wallBannerTex);
    const bannerMat = track(
      new THREE.MeshStandardMaterial({ map: wallBannerTex, roughness: 0.45 })
    );
    const wallSign = new THREE.Mesh(track(new THREE.BoxGeometry(6.8, 2.1, 0.08)), bannerMat);
    wallSign.position.set(0, 3.85, -5.6);
    scene.add(wallSign);

    const createPedestal = (x: number, z: number, w = 1.5, h = 1.0, dLen = 1.5) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const plinth = new THREE.Mesh(
        track(new THREE.BoxGeometry(w, h, dLen)),
        limestonePedestalMat
      );
      plinth.position.y = h / 2;
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      group.add(plinth);

      const trim = new THREE.Mesh(track(new THREE.BoxGeometry(w + 0.06, 0.06, dLen + 0.06)), teakMat);
      trim.position.y = h - 0.03;
      group.add(trim);

      const baseKick = new THREE.Mesh(
        track(new THREE.BoxGeometry(w + 0.04, 0.08, dLen + 0.04)),
        darkBakeliteMat
      );
      baseKick.position.y = 0.04;
      group.add(baseKick);

      return group;
    };

    const clickableProxies: THREE.Mesh[] = [];
    const registerClickable = (zoneId: string, center: THREE.Vector3, size: THREE.Vector3) => {
      const proxy = new THREE.Mesh(
        track(new THREE.BoxGeometry(size.x, size.y, size.z)),
        track(new THREE.MeshBasicMaterial({ visible: false }))
      );
      proxy.position.copy(center);
      proxy.layers.set(1);
      proxy.userData.zoneId = zoneId;
      scene.add(proxy);
      clickableProxies.push(proxy);
    };

    // Exhibit 1: Radio Mic & Transmitter
    const radioZone = createPedestal(-3.2, -0.8, 1.55, 0.95, 1.35);
    const micBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.18, 0.22, 0.06, 24)), darkBakeliteMat);
    micBase.position.set(-0.22, 0.98, 0.15);
    micBase.castShadow = true;
    radioZone.add(micBase);

    const micStem = new THREE.Mesh(track(new THREE.CylinderGeometry(0.02, 0.025, 0.42, 16)), chromeMat);
    micStem.position.set(-0.22, 1.2, 0.15);
    micStem.castShadow = true;
    radioZone.add(micStem);

    const micYoke = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.12, 0.014, 12, 24, Math.PI)),
      brassMat
    );
    micYoke.rotation.z = Math.PI;
    micYoke.position.set(-0.22, 1.48, 0.15);
    radioZone.add(micYoke);

    const micCapsule = new THREE.Mesh(
      track(new THREE.CapsuleGeometry(0.085, 0.14, 8, 20)),
      chromeMat
    );
    micCapsule.position.set(-0.22, 1.52, 0.15);
    micCapsule.castShadow = true;
    radioZone.add(micCapsule);

    const txBox = new THREE.Mesh(track(new THREE.BoxGeometry(0.62, 0.42, 0.36)), darkBakeliteMat);
    txBox.position.set(0.28, 1.16, -0.12);
    txBox.castShadow = true;
    radioZone.add(txBox);

    const txDial = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.32, 0.1)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xfde68a,
          emissive: 0xd97706,
          emissiveIntensity: 0.7,
        })
      )
    );
    txDial.position.set(0.28, 1.22, 0.062);
    radioZone.add(txDial);

    for (let k = 0; k < 3; k++) {
      const knob = new THREE.Mesh(track(new THREE.CylinderGeometry(0.032, 0.032, 0.03, 16)), brassMat);
      knob.rotation.x = Math.PI / 2;
      knob.position.set(0.14 + k * 0.14, 1.07, 0.065);
      radioZone.add(knob);
    }
    scene.add(radioZone);
    registerClickable('radio', new THREE.Vector3(-3.2, 1.15, -0.8), new THREE.Vector3(1.7, 1.8, 1.5));

    // Exhibit 2: Gramophone & Turntable
    const turntableZone = createPedestal(0, 0.3, 1.65, 0.92, 1.5);
    const plinthBox = new THREE.Mesh(track(new THREE.BoxGeometry(0.92, 0.16, 0.76)), teakMat);
    plinthBox.position.set(0, 1.0, 0.04);
    plinthBox.castShadow = true;
    turntableZone.add(plinthBox);

    const deckPlate = new THREE.Mesh(track(new THREE.BoxGeometry(0.84, 0.025, 0.68)), darkBakeliteMat);
    deckPlate.position.set(0, 1.092, 0.04);
    turntableZone.add(deckPlate);

    const platterMesh = new THREE.Mesh(track(new THREE.CylinderGeometry(0.26, 0.27, 0.03, 36)), chromeMat);
    platterMesh.position.set(-0.08, 1.12, 0.04);
    turntableZone.add(platterMesh);

    const vinylGroup = new THREE.Group();
    vinylGroup.position.set(-0.08, 1.142, 0.04);
    const vinylDisc = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.245, 0.245, 0.012, 40)),
      track(new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.25, metalness: 0.3 }))
    );
    vinylGroup.add(vinylDisc);
    const vinylLabel = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.085, 0.085, 0.014, 24)),
      track(new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.5 }))
    );
    vinylGroup.add(vinylLabel);
    const spindle = new THREE.Mesh(track(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12)), chromeMat);
    spindle.position.y = 0.015;
    vinylGroup.add(spindle);
    turntableZone.add(vinylGroup);

    const armPivot = new THREE.Mesh(track(new THREE.CylinderGeometry(0.035, 0.04, 0.06, 16)), chromeMat);
    armPivot.position.set(0.28, 1.135, -0.15);
    turntableZone.add(armPivot);
    const armTube = new THREE.Mesh(track(new THREE.CylinderGeometry(0.008, 0.008, 0.34, 12)), chromeMat);
    armTube.rotation.x = Math.PI / 2;
    armTube.rotation.z = 0.42;
    armTube.position.set(0.19, 1.16, 0.0);
    turntableZone.add(armTube);

    const hornPts = [
      new THREE.Vector2(0.025, 0.0),
      new THREE.Vector2(0.04, 0.14),
      new THREE.Vector2(0.08, 0.3),
      new THREE.Vector2(0.17, 0.44),
      new THREE.Vector2(0.28, 0.52),
    ];
    const hornGeo = track(new THREE.LatheGeometry(hornPts, 28));
    const hornMesh = new THREE.Mesh(hornGeo, brassMat);
    hornMesh.position.set(0.24, 1.24, -0.22);
    hornMesh.rotation.x = Math.PI * 0.36;
    hornMesh.rotation.z = 0.25;
    hornMesh.castShadow = true;
    turntableZone.add(hornMesh);

    scene.add(turntableZone);
    registerClickable('turntable', new THREE.Vector3(0, 1.15, 0.3), new THREE.Vector3(1.8, 1.8, 1.6));

    // Exhibit 3: Channel 4 TV Camera & CRT Monitor
    const tvZone = createPedestal(3.2, -0.8, 1.75, 0.92, 1.45);
    const dollyBase = new THREE.Mesh(track(new THREE.CylinderGeometry(0.24, 0.28, 0.06, 6)), darkBakeliteMat);
    dollyBase.position.set(-0.25, 0.95, 0.12);
    tvZone.add(dollyBase);

    const camPillar = new THREE.Mesh(track(new THREE.CylinderGeometry(0.055, 0.07, 0.55, 16)), chromeMat);
    camPillar.position.set(-0.25, 1.24, 0.12);
    camPillar.castShadow = true;
    tvZone.add(camPillar);

    const camBody = new THREE.Mesh(track(new THREE.BoxGeometry(0.32, 0.3, 0.48)), darkBakeliteMat);
    camBody.position.set(-0.25, 1.62, 0.12);
    camBody.rotation.y = -0.35;
    camBody.castShadow = true;
    tvZone.add(camBody);

    const lensAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
    lensAngles.forEach((ang) => {
      const lens = new THREE.Mesh(track(new THREE.CylinderGeometry(0.036, 0.04, 0.1, 16)), chromeMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(
        -0.25 + Math.cos(ang) * 0.06 - 0.09,
        1.62 + Math.sin(ang) * 0.06,
        0.37
      );
      tvZone.add(lens);
    });

    const crtBox = new THREE.Mesh(track(new THREE.BoxGeometry(0.54, 0.44, 0.42)), teakMat);
    crtBox.position.set(0.36, 1.14, -0.1);
    crtBox.castShadow = true;
    tvZone.add(crtBox);

    const testCardTex = createCanvasTexture(
      256,
      256,
      (ctx, w, h) => {
        ctx.fillStyle = '#27272A';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#E4E4E7';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 92, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#F4F4F5';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ไทยทีวี ช่อง 4', w / 2, h / 2 - 6);
        ctx.font = '18px monospace';
        ctx.fillText('CH.4 · 1955', w / 2, h / 2 + 26);
      },
      maxAniso
    );
    track(testCardTex);
    const crtScreen = new THREE.Mesh(
      track(new THREE.PlaneGeometry(0.38, 0.3)),
      track(
        new THREE.MeshStandardMaterial({
          map: testCardTex,
          emissive: 0xffffff,
          emissiveMap: testCardTex,
          emissiveIntensity: 0.45,
          roughness: 0.15,
        })
      )
    );
    crtScreen.position.set(0.36, 1.15, 0.114);
    tvZone.add(crtScreen);
    scene.add(tvZone);
    registerClickable('tv4', new THREE.Vector3(3.2, 1.25, -0.8), new THREE.Vector3(1.9, 1.9, 1.6));

    // Exhibit 4: Illuminated Glass Vitrine
    const vitrineZone = createPedestal(0, -3.7, 2.1, 0.95, 1.25);
    const docTex = createCanvasTexture(
      512,
      384,
      (ctx, w, h) => {
        ctx.fillStyle = '#EFE3C8';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#8C7A5B';
        ctx.lineWidth = 4;
        ctx.strokeRect(16, 16, w - 32, h - 32);
        ctx.fillStyle = '#292524';
        ctx.font = 'bold 24px serif';
        ctx.textAlign = 'center';
        ctx.fillText('ประกาศสำนักนายกรัฐมนตรี', w / 2, 74);
        ctx.font = '18px serif';
        ctx.fillText('ว่าด้วยการจัดตั้งสำนักงานโฆษณาการ พ.ศ. ๒๔๗๖', w / 2, 114);
        ctx.fillStyle = '#57534E';
        for (let line = 0; line < 6; line++) {
          ctx.fillRect(72, 154 + line * 26, w - 144, 4);
        }
        ctx.strokeStyle = '#1E3A8A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w - 110, h - 82, 34, 0, Math.PI * 2);
        ctx.stroke();
      },
      maxAniso
    );
    track(docTex);

    const docStand = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.95, 0.04, 0.68)),
      track(new THREE.MeshStandardMaterial({ map: docTex, roughness: 0.7 }))
    );
    docStand.position.set(-0.22, 1.1, 0);
    docStand.rotation.x = 0.28;
    vitrineZone.add(docStand);

    const ledgerBook = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.48, 0.09, 0.62)),
      track(new THREE.MeshStandardMaterial({ color: 0x7f1d1d, roughness: 0.6 }))
    );
    ledgerBook.position.set(0.55, 1.0, 0.02);
    vitrineZone.add(ledgerBook);

    const glassHood = new THREE.Mesh(track(new THREE.BoxGeometry(1.96, 0.68, 1.12)), glassMat);
    glassHood.position.set(0, 1.3, 0);
    glassHood.renderOrder = 2;
    vitrineZone.add(glassHood);

    scene.add(vitrineZone);
    registerClickable('vitrine', new THREE.Vector3(0, 1.2, -3.7), new THREE.Vector3(2.2, 1.8, 1.4));

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    let lastHoverTime = 0;
    let pointerDownPos = { x: 0, y: 0 };

    const updateMouse = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      _mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 60) return;
      lastHoverTime = now;

      updateMouse(e.clientX, e.clientY);
      raycaster.setFromCamera(_mouse, camera);
      const hits = raycaster.intersectObjects(clickableProxies, false);
      if (hits.length > 0) {
        const zoneId = hits[0].object.userData.zoneId as string;
        renderer.domElement.style.cursor = 'pointer';
        setHoveredZoneId(zoneId);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredZoneId(null);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;
      updateMouse(e.clientX, e.clientY);
      raycaster.setFromCamera(_mouse, camera);
      const hits = raycaster.intersectObjects(clickableProxies, false);
      if (hits.length > 0) {
        const zoneId = hits[0].object.userData.zoneId as string;
        onSelectZoneRef.current(zoneId);
      }
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 960;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastClock = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const now = performance.now();
        const dt = Math.min(0.1, (now - lastClock) / 1000);
        lastClock = now;

        let needsAnotherFrame = false;

        if (transitionActiveRef.current) {
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 5.2, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 5.2, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 5.2, dt);
          controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetLookAt.x, 5.2, dt);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetLookAt.y, 5.2, dt);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetLookAt.z, 5.2, dt);

          const distLeft =
            camera.position.distanceTo(_targetCamPos) + controls.target.distanceTo(_targetLookAt);
          if (distLeft < 0.025) {
            transitionActiveRef.current = false;
          } else {
            needsAnotherFrame = true;
          }
        }

        if (isAudioPlayingRef.current) {
          vinylGroup.rotation.y -= dt * 3.4;
          needsAnotherFrame = true;
        }

        const controlsChanged = controls.update();
        if (controlsChanged) needsAnotherFrame = true;

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsAnotherFrame) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    const onControlsChange = () => requestRender();
    controls.addEventListener('change', onControlsChange);

    requestRender();
    const audioSyncTimer = window.setInterval(() => {
      if (isAudioPlayingRef.current) {
        requestRender();
      }
    }, 300);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      clearInterval(audioSyncTimer);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlsChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      disposables.forEach((dItem) => dItem.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentZone =
    MUSEUM_3D_ZONES.find((z) => z.id === activeZoneId) ?? MUSEUM_3D_ZONES[0];
  const hoveredZone = hoveredZoneId
    ? MUSEUM_3D_ZONES.find((z) => z.id === hoveredZoneId) ?? null
    : null;

  return (
    <section
      id="museum-3d"
      aria-labelledby="museum-3d-heading"
      className="border-t border-[#E4E0D8] bg-[#141413] py-16 text-white md:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-[#D4AF37]">{t.kicker}</p>
            <h2
              id="museum-3d-heading"
              className="text-balance mt-1.5 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              {t.heading}
            </h2>
          </div>
          <p className="flex items-center gap-2 text-xs text-[#D6D3D1]">
            <Move3d className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.instructions}</span>
          </p>
        </div>

        <div className="relative h-[520px] w-full overflow-hidden rounded-xl border border-white/15 bg-[#1C1A17] sm:h-[620px]">
          <div ref={mountRef} className="h-full w-full" />

          {contextLost && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#1C1A17] p-6 text-center">
              <p className="text-lg font-semibold text-white">{t.fallbackTitle}</p>
              <p className="mt-2 max-w-md text-sm text-[#A8A29E]">{t.fallbackDesc}</p>
            </div>
          )}

          {/* Minimal Top-Left Curatorial Spec Label */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-md rounded-lg border border-white/15 bg-[#161514]/90 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <span>{lang === 'th' ? currentZone.yearBE : currentZone.yearEn}</span>
              {hoveredZone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-white">
                    {t.hoverPrefix} {lang === 'th' ? hoveredZone.label : hoveredZone.labelEn}
                  </span>
                </>
              )}
            </div>
            <h3 className="mt-0.5 text-base font-semibold text-white sm:text-lg">
              {lang === 'th' ? currentZone.title : currentZone.titleEn}
            </h3>
            {!dockCollapsed && (
              <p className="mt-1 hidden text-xs leading-relaxed text-[#D6D3D1] sm:block">
                {lang === 'th' ? currentZone.description : currentZone.descriptionEn}
              </p>
            )}
          </div>

          {/* Collapsible Bottom Control Dock */}
          <div
            className={`absolute bottom-4 left-1/2 z-20 w-[min(940px,94%)] -translate-x-1/2 transition-transform duration-300 ${
              dockCollapsed ? 'translate-y-[calc(100%-34px)]' : 'translate-y-0'
            }`}
          >
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setDockCollapsed((c) => !c)}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-t-lg border border-b-0 border-white/20 bg-[#161514]/95 px-4 py-1 text-xs font-medium text-[#E7E5E4] hover:text-white"
              >
                {dockCollapsed ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>{t.showDock}</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>{t.hideDock}</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-xl border border-white/20 bg-[#161514]/95 p-3 shadow-2xl sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div
                  className="flex flex-wrap items-center gap-1.5"
                  role="tablist"
                  aria-label={t.heading}
                >
                  {MUSEUM_3D_ZONES.map((zone) => {
                    const active = zone.id === activeZoneId;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onSelectZone(zone.id)}
                        className={`min-h-[40px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#D4AF37] font-semibold text-[#141413]'
                            : 'bg-white/10 text-[#E7E5E4] hover:bg-white/20'
                        }`}
                      >
                        {lang === 'th' ? zone.label : zone.labelEn}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-2.5 lg:border-t-0 lg:pt-0">
                  <button
                    type="button"
                    onClick={() => onSelectZone('overview')}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-xs text-[#E7E5E4] hover:bg-white/10 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t.resetCamera}</span>
                  </button>

                  {currentZone.vinylTrackId && (
                    <button
                      type="button"
                      onClick={() => onPlayVinyl(currentZone.vinylTrackId!)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-[#1E3A8A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
                    >
                      <Disc3 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t.playVinyl}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenArchiveItem(currentZone.archiveId)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md bg-white px-3.5 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#E7E5E4] whitespace-nowrap shrink-0"
                  >
                    <span>{t.openRecord}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
