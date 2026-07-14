import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings2, PlayCircle, Film } from 'lucide-react';

export default function VideoSettings({ settings, onSettingsChange, onRegenerate, imageCount, disabled }) {
  const handleChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const estimatedDuration = imageCount * settings.duration;

  return (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="font-bold font-sans flex items-center gap-2 text-foreground">
          <Settings2 className="w-5 h-5 text-primary" />
          Slideshow Settings
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-lg border border-border/50">
          <Film className="w-4 h-4" />
          Est. Duration: {estimatedDuration}s
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="text-foreground">Image Duration ({settings.duration}s)</Label>
          </div>
          <Slider 
            min={2} 
            max={5} 
            step={0.5} 
            value={[settings.duration]} 
            onValueChange={([val]) => handleChange('duration', val)}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">Time each photo stays on screen</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Transition Effect</Label>
            <Select 
              value={settings.transition} 
              onValueChange={(val) => handleChange('transition', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="Select transition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Crossfade</SelectItem>
                <SelectItem value="ken-burns">Ken Burns (Zoom & Pan)</SelectItem>
                <SelectItem value="zoom">Zoom In</SelectItem>
                <SelectItem value="random-mix">Random Mix</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Resolution</Label>
            <Select 
              value={settings.resolution} 
              onValueChange={(val) => handleChange('resolution', val)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="720p">720p (HD)</SelectItem>
                <SelectItem value="1080p">1080p (Full HD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={onRegenerate} 
          disabled={disabled || imageCount === 0} 
          className="w-full font-bold font-sans"
          variant="secondary"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          {disabled ? 'Generating...' : 'Generate Slideshow Video'}
        </Button>
      </div>
    </div>
  );
}