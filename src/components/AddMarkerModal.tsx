import { useState, useRef, useEffect } from 'react';
import { Upload, X, Images, RotateCcw, Plus, Trash2, icons } from 'lucide-react';
import type { Marker, MarkerType, GalleryImage, Skin } from '@/types';

interface AddMarkerModalProps {
  x: number;
  y: number;
  skin: Skin;
  markerTypes: MarkerType[];
  onClose: () => void;
  onSave: (type: string, name: string, imageBase64: string, description: string, iconImage: string, iconSize: number) => void;
  editMarker?: Marker | null;
  onOpenGallery?: (callback: (image: GalleryImage) => void) => void;
  onOpenIconGallery?: (callback: (image: GalleryImage) => void) => void;
  onAddMarkerType?: (name: string, color: string, icon: string) => void;
  onDeleteMarkerType?: (typeId: string) => void;
}

const AVAILABLE_ICONS = [
  'Skull', 'Key', 'MapPin', 'Flag', 'Star', 'Heart', 'Shield', 'Sword',
  'Target', 'Crosshair', 'AlertTriangle', 'Info', 'Home', 'Anchor',
  'Zap', 'Flame', 'Snowflake', 'Cloud', 'Sun', 'Moon',
  'Circle', 'Square', 'Triangle', 'Diamond', 'Hexagon',
  'User', 'Users', 'Bot', 'Ghost', 'Cat',
  'Car', 'Plane', 'Ship', 'Train', 'Rocket',
  'TreePine', 'Mountain', 'Building', 'Castle', 'Church',
  'Briefcase', 'ShoppingCart', 'Coffee', 'Utensils', 'Beer',
  'Music', 'Camera', 'Gamepad2', 'Dices', 'Puzzle',
  'Wrench', 'Hammer', 'Pickaxe', 'Shovel', 'Axe',
];

export function AddMarkerModal({ x, y, skin, markerTypes, onClose, onSave, editMarker, onOpenGallery, onOpenIconGallery, onAddMarkerType, onDeleteMarkerType }: AddMarkerModalProps) {
  const [type, setType] = useState<string>(markerTypes[0]?.id || 'red');
  const [name, setName] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [iconImage, setIconImage] = useState('');
  const [iconSize, setIconSize] = useState(40);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const [showAddType, setShowAddType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#3b82f6');
  const [newTypeIcon, setNewTypeIcon] = useState('MapPin');
  const [deleteConfirmType, setDeleteConfirmType] = useState<string | null>(null);

  useEffect(() => {
    if (editMarker) {
      setType(editMarker.type);
      setName(editMarker.name);
      setImageBase64(editMarker.imageBase64);
      setIconImage(editMarker.iconImage || '');
      setIconSize(editMarker.iconSize ?? 40);
      setDescription(editMarker.description);
    } else {
      setType(markerTypes[0]?.id || 'red');
      setName('');
      setImageBase64('');
      setIconImage('');
      setIconSize(40);
      setDescription('');
    }
  }, [editMarker, markerTypes]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setIconImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(type, name, imageBase64, description, iconImage, iconSize);
    onClose();
  };

  const handleResetIcon = () => {
    setIconImage('');
    setIconSize(40);
  };

  const handleAddType = () => {
    if (newTypeName.trim() && onAddMarkerType) {
      onAddMarkerType(newTypeName.trim(), newTypeColor, newTypeIcon);
      setNewTypeName('');
      setNewTypeColor('#3b82f6');
      setNewTypeIcon('MapPin');
      setShowAddType(false);
    }
  };

  const handleDeleteType = (typeId: string) => {
    if (deleteConfirmType === typeId) {
      if (onDeleteMarkerType) {
        onDeleteMarkerType(typeId);
        if (type === typeId) setType(markerTypes[0]?.id || 'red');
      }
      setDeleteConfirmType(null);
    } else {
      setDeleteConfirmType(typeId);
      setTimeout(() => setDeleteConfirmType(null), 3000);
    }
  };

  const getSelectedType = () => markerTypes.find(t => t.id === type);

  const TypeIconComponent = ({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) => {
    const LucideIcon = (icons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
    if (LucideIcon) {
      return <LucideIcon className={className} style={style} />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 sm:items-center animate-fade-in-up">
      <div className={`rounded-t-2xl sm:rounded-lg border-t sm:border w-full sm:max-w-md p-4 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto transition-all duration-500 ${
        skin === 'skin2'
          ? 'bg-[#12121a] border-[#1a1a2e]'
          : 'bg-military-800 border-military-600'
      }`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className={`text-lg font-semibold transition-all duration-500 ${
            skin === 'skin2' ? 'text-white skin2-text-glow' : 'text-white'
          }`}>{editMarker ? '编辑标记点位' : '添加标记点位'}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded transition-all duration-300 ${
              skin === 'skin2' ? 'hover:bg-[#1a1a2e]' : 'hover:bg-military-700'
            }`}
          >
            <X className={`w-5 h-5 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>坐标</label>
            <div className={`px-4 py-2 rounded border text-sm transition-all duration-500 ${
              skin === 'skin2' ? 'bg-[#0a0a0f] border-[#1a1a2e] text-[#8888aa]' : 'bg-military-900 border-military-700 text-military-300'
            }`}>
              X: {x.toFixed(2)}% | Y: {y.toFixed(2)}%
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>标记类型</label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {markerTypes.map((mt) => {
                const isSelected = type === mt.id;
                return (
                  <button
                    key={mt.id}
                    onClick={() => setType(mt.id)}
                    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded border-2 transition-all ${
                      skin === 'skin2' ? 'hover:scale-[1.02]' : ''
                    }`}
                    style={isSelected
                      ? skin === 'skin2'
                        ? { borderColor: mt.glowColor, backgroundColor: `${mt.glowColor}33`, color: mt.glowColor, boxShadow: `0 0 15px ${mt.glowColor}4d` }
                        : { borderColor: mt.color, backgroundColor: `${mt.color}33`, color: mt.color }
                      : skin === 'skin2'
                        ? { borderColor: '#1a1a2e', backgroundColor: '#0a0a0f', color: '#8888aa' }
                        : { borderColor: '#475569', backgroundColor: '#0f172a', color: '#94a3b8' }
                    }
                  >
                    <TypeIconComponent iconName={mt.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm">{mt.name}</span>
                  </button>
                );
              })}
              <button
                onClick={() => setShowAddType(!showAddType)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded border-2 border-dashed transition-all ${
                  skin === 'skin2'
                    ? 'border-[#1a1a2e] text-[#8888aa] hover:border-[#00f5ff] hover:text-[#00f5ff]'
                    : 'border-military-600 text-military-400 hover:border-military-400 hover:text-military-300'
                }`}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm">添加类型</span>
              </button>
            </div>

            {showAddType && (
              <div className={`mt-3 p-3 rounded-lg border transition-all duration-500 ${
                skin === 'skin2' ? 'bg-[#0a0a0f] border-[#1a1a2e]' : 'bg-military-900 border-military-700'
              }`}>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="类型名称..."
                  className={`w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-all duration-500 mb-2 ${
                    skin === 'skin2'
                      ? 'bg-[#12121a] border border-[#1a1a2e] focus:border-[#00f5ff] placeholder-[#444466]'
                      : 'bg-military-800 border border-military-700 focus:border-military-500 placeholder-military-500'
                  }`}
                />
                <div className="flex items-center gap-2 mb-2">
                  <label className={`text-xs ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>颜色:</label>
                  <input
                    type="color"
                    value={newTypeColor}
                    onChange={(e) => setNewTypeColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <span className={`text-xs font-mono ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>{newTypeColor}</span>
                </div>
                <div className="mb-2">
                  <label className={`text-xs block mb-1 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>图标:</label>
                  <div className="grid grid-cols-8 gap-1">
                    {AVAILABLE_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        onClick={() => setNewTypeIcon(iconName)}
                        className={`p-1.5 rounded transition-all ${
                          newTypeIcon === iconName
                            ? skin === 'skin2'
                              ? 'bg-[#00f5ff]/20 text-[#00f5ff]'
                              : 'bg-blue-600/20 text-blue-400'
                            : skin === 'skin2'
                              ? 'hover:bg-[#1a1a2e] text-[#8888aa]'
                              : 'hover:bg-military-700 text-military-400'
                        }`}
                        title={iconName}
                      >
                        <TypeIconComponent iconName={iconName} className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddType}
                  disabled={!newTypeName.trim()}
                  className={`w-full px-3 py-2 rounded-lg text-white text-sm transition-all duration-300 disabled:cursor-not-allowed ${
                    skin === 'skin2'
                      ? 'bg-gradient-to-r from-[#00f5ff] to-[#0088aa] hover:from-[#00ffff] hover:to-[#00aacc] disabled:bg-[#1a1a2e]/50'
                      : 'bg-blue-600 hover:bg-blue-500 disabled:bg-military-700'
                  }`}
                >
                  确认添加
                </button>
              </div>
            )}

            {markerTypes.some(t => !t.builtin) && (
              <div className="mt-2">
                <label className={`text-xs block mb-1 ${skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'}`}>自定义类型管理:</label>
                <div className="flex flex-wrap gap-1">
                  {markerTypes.filter(t => !t.builtin).map((mt) => (
                    <button
                      key={mt.id}
                      onClick={() => handleDeleteType(mt.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                        deleteConfirmType === mt.id
                          ? 'bg-red-600 text-white'
                          : skin === 'skin2'
                            ? 'bg-[#1a1a2e]/50 text-[#8888aa] hover:bg-red-900/50 hover:text-red-400'
                            : 'bg-military-700 text-military-400 hover:bg-red-900/50 hover:text-red-400'
                      }`}
                    >
                      <TypeIconComponent iconName={mt.icon} className="w-3 h-3" />
                      <span>{mt.name}</span>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  ))}
                </div>
                {deleteConfirmType && (
                  <p className={`text-xs mt-1 ${skin === 'skin2' ? 'text-red-400' : 'text-red-400'}`}>再次点击确认删除该类型及其所有点位</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>点位名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入点位名称..."
              className={`w-full rounded-lg px-4 py-2 text-white focus:outline-none transition-all duration-500 ${
                skin === 'skin2'
                  ? 'bg-[#0a0a0f] border border-[#1a1a2e] focus:border-[#00f5ff] placeholder-[#444466]'
                  : 'bg-military-900 border border-military-700 focus:border-military-500 placeholder-military-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>点位图标</label>
            <div className={`rounded-lg p-3 transition-all duration-500 ${
              skin === 'skin2' ? 'bg-[#0a0a0f] border border-[#1a1a2e]' : 'bg-military-900 border border-military-700'
            }`}>
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full flex items-center justify-center border-2 overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    skin === 'skin2' ? 'shadow-[0_0_10px_rgba(0,245,255,0.3)]' : ''
                  }`}
                  style={{
                    width: `${iconSize}px`,
                    height: `${iconSize}px`,
                    backgroundColor: iconImage ? (skin === 'skin2' ? '#12121a' : '#0f172a') : (getSelectedType()?.color || '#64748b'),
                    borderColor: iconImage ? (skin === 'skin2' ? '#00f5ff' : '#64748b') : (getSelectedType()?.color || '#64748b'),
                  }}
                >
                  {iconImage ? (
                    <img src={iconImage} alt="图标" className="w-full h-full object-cover" />
                  ) : (
                    <TypeIconComponent
                      iconName={getSelectedType()?.icon || 'MapPin'}
                      className="text-white"
                      style={{ width: `${iconSize * 0.5}px`, height: `${iconSize * 0.5}px` }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs mb-1 transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
                  }`}>当前图标</div>
                  <div className={`text-xs truncate transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
                  }`}>
                    {iconImage ? '自定义图标' : `系统默认（${getSelectedType()?.name || '未知'}）`}
                  </div>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded transition-all duration-300 text-xs ${
                    skin === 'skin2'
                      ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-[#8888aa]'
                      : 'bg-military-700 hover:bg-military-600 text-military-300'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>上传</span>
                </button>
                {onOpenIconGallery && (
                  <button
                    type="button"
                    onClick={() => onOpenIconGallery((img) => setIconImage(img.imageBase64))}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded transition-all duration-300 text-xs ${
                      skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-[#8888aa]'
                        : 'bg-military-700 hover:bg-military-600 text-military-300'
                    }`}
                  >
                    <Images className="w-3.5 h-3.5" />
                    <span>仓库</span>
                  </button>
                )}
                {iconImage && (
                  <button
                    type="button"
                    onClick={handleResetIcon}
                    className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded transition-all duration-300 text-xs ${
                      skin === 'skin2'
                        ? 'bg-[#1a1a2e]/50 hover:bg-[#ff00ff]/20 text-[#8888aa] hover:text-[#ff00ff]'
                        : 'bg-military-700 hover:bg-red-900/50 text-military-300 hover:text-red-400'
                    }`}
                    title="恢复默认图标"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <input
                ref={iconInputRef}
                type="file"
                accept="image/*"
                onChange={handleIconFileChange}
                className="hidden"
              />
              
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
                  }`}>图标大小</label>
                  <span className={`text-xs font-mono transition-all duration-500 ${
                    skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-300'
                  }`}>{iconSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="2"
                  value={iconSize}
                  onChange={(e) => setIconSize(parseInt(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all duration-500 ${
                    skin === 'skin2' ? 'accent-[#00f5ff]' : 'accent-blue-500'
                  }`}
                  style={{
                    background: skin === 'skin2'
                      ? `linear-gradient(to right, #00f5ff 0%, #00f5ff ${((iconSize - 20) / 60) * 100}%, #1a1a2e ${((iconSize - 20) / 60) * 100}%, #1a1a2e 100%)`
                      : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((iconSize - 20) / 60) * 100}%, #374151 ${((iconSize - 20) / 60) * 100}%, #374151 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>点位详情图片</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all duration-500 ${
                skin === 'skin2'
                  ? 'border-[#1a1a2e] hover:border-[#00f5ff]'
                  : 'border-military-600 hover:border-military-500'
              }`}
            >
              <Upload className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 transition-all duration-500 ${
                skin === 'skin2' ? 'text-[#444466]' : 'text-military-500'
              }`} />
              {imageBase64 ? (
                <img src={imageBase64} alt="点位图片" className="max-h-24 sm:max-h-32 mx-auto rounded" />
              ) : (
                <span className={`text-sm transition-all duration-500 ${
                  skin === 'skin2' ? 'text-[#444466]' : 'text-military-500'
                }`}>点击上传点位详情图片</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {onOpenGallery && (
              <button
                onClick={() => onOpenGallery((img) => setImageBase64(img.imageBase64))}
                className={`w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  skin === 'skin2'
                    ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-[#8888aa]'
                    : 'bg-military-700 hover:bg-military-600 text-military-300'
                }`}
              >
                <Images className="w-4 h-4" />
                <span className="text-sm">从图片仓库选择</span>
              </button>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 transition-all duration-500 ${
              skin === 'skin2' ? 'text-[#8888aa]' : 'text-military-400'
            }`}>描述信息</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入点位描述信息..."
              className={`w-full rounded-lg px-4 py-2 text-white resize-none focus:outline-none transition-all duration-500 ${
                skin === 'skin2'
                  ? 'bg-[#0a0a0f] border border-[#1a1a2e] focus:border-[#00f5ff] placeholder-[#444466]'
                  : 'bg-military-900 border border-military-700 focus:border-military-500 placeholder-military-500'
              }`}
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 ${
              skin === 'skin2'
                ? 'bg-[#1a1a2e]/50 hover:bg-[#1a1a2e] text-white'
                : 'bg-military-700 hover:bg-military-600 text-white'
            }`}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-300"
            style={{
              background: `linear-gradient(to right, ${getSelectedType()?.color || '#3b82f6'}, ${getSelectedType()?.glowColor || '#3b82f6'})`,
            }}
          >
            {editMarker ? '保存修改' : '添加标记'}
          </button>
        </div>
      </div>
    </div>
  );
}
