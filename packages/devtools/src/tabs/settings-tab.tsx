import { Show } from 'solid-js'
import { Input } from '../components/input'
import { Select } from '../components/select'
import { useDevtoolsSettings } from '../context/use-devtools-context'
import { uppercaseFirstLetter } from '../utils/sanitize'
import { Checkbox } from '../components/checkbox'

export const SettingsTab = () => {
  const { setSettings, settings } = useDevtoolsSettings()
  return (
    <div>
      <Checkbox
        label="Default open"
        onChange={() => setSettings({ defaultOpen: !settings().defaultOpen })}
        checked={settings().defaultOpen}
      />{' '}
      <Checkbox
        label="Hide the devtools trigger until hovered"
        onChange={() =>
          setSettings({ hideUntilHover: !settings().hideUntilHover })
        }
        checked={settings().hideUntilHover}
      />
      <Checkbox
        label="Require URL Flag"
        checked={settings().requireUrlFlag}
        onChange={(checked) =>
          setSettings({
            requireUrlFlag: checked,
          })
        }
      />
      <Show when={settings().requireUrlFlag}>
        <Input
          label="URL flag"
          value={settings().urlFlag}
          onChange={(e) =>
            setSettings({
              urlFlag: e,
            })
          }
        />
      </Show>
      <Input
        label="Hotkey to open/close devtools"
        value={settings().openHotkey.join('+')}
        onChange={(e) =>
          setSettings({
            openHotkey: e
              .split('+')
              .map((key) => uppercaseFirstLetter(key))
              .filter(Boolean),
          })
        }
      />
      <Select
        label="Trigger Position"
        options={[
          { label: 'Bottom Right', value: 'bottom-right' },
          { label: 'Bottom Left', value: 'bottom-left' },
          { label: 'Top Right', value: 'top-right' },
          { label: 'Top Left', value: 'top-left' },
          { label: 'Middle Right', value: 'middle-right' },
          { label: 'Middle Left', value: 'middle-left' },
        ]}
        value={settings().position}
        onChange={(value) =>
          setSettings({
            position: value,
          })
        }
      />{' '}
      <Select
        label="Panel Position"
        value={settings().panelLocation}
        options={[
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
        ]}
        onChange={(value) =>
          setSettings({
            panelLocation: value,
          })
        }
      />
    </div>
  )
}
