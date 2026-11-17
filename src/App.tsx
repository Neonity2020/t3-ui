import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/registry/default/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/registry/default/ui/alert";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompletePopup,
} from "@/registry/default/ui/autocomplete";
import { Badge } from "@/registry/default/ui/badge";
import { Button } from "@/registry/default/ui/button";
import { Calendar } from "@/registry/default/ui/calendar";
import { Checkbox } from "@/registry/default/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/registry/default/ui/collapsible";
import { ColorHueSlider, ColorSaturationValuePlane } from "@/registry/default/ui/color-picker";
import {
  Combobox,
  ComboboxInput,
  ComboboxItem,
  ComboboxPopup,
} from "@/registry/default/ui/combobox";
import {
  Command,
  CommandDialog,
  CommandDialogTrigger,
  CommandItem,
} from "@/registry/default/ui/command";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/registry/default/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/default/ui/empty";
import { Group, GroupSeparator } from "@/registry/default/ui/group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/registry/default/ui/input-group";
import { Input } from "@/registry/default/ui/input";
import { Kbd, KbdGroup } from "@/registry/default/ui/kbd";
import { Label } from "@/registry/default/ui/label";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/registry/default/ui/menu";
import { MiddleTruncate } from "@/registry/default/ui/middle-truncate";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/registry/default/ui/number-field";
import {
  Popover,
  PopoverClose,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/default/ui/popover";
import { PreviewCard, PreviewCardPopup, PreviewCardTrigger } from "@/registry/default/ui/preview-card";
import { QRCodeSvg } from "@/registry/default/ui/qr-code";
import { Radio, RadioGroup } from "@/registry/default/ui/radio-group";
import { ScrollArea } from "@/registry/default/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/default/ui/select";
import { Separator } from "@/registry/default/ui/separator";
import {
  Sheet,
  SheetDescription,
  SheetPopup,
  SheetTitle,
} from "@/registry/default/ui/sheet";
import { Skeleton } from "@/registry/default/ui/skeleton";
import { Spinner } from "@/registry/default/ui/spinner";
import { Switch } from "@/registry/default/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/default/ui/table";
import { Textarea } from "@/registry/default/ui/textarea";
import { Toggle, ToggleGroup } from "@/registry/default/ui/toggle-group";
import {
  Tooltip,
  TooltipPopup,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/default/ui/tooltip";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}

function AutocompleteDemo() {
  const [value, setValue] = useState("");
  const items = ["apple", "banana", "cherry", "grape", "mango"];
  return (
    <Autocomplete
      items={items}
      value={value}
      onValueChange={(next) => setValue(next ?? "")}
      itemToStringValue={(item) => item}
      openOnInputClick
    >
      <AutocompleteInput placeholder="Fruit…" />
      <AutocompletePopup>
        {items.map((item) => (
          <AutocompleteItem key={item} value={item}>
            {item}
          </AutocompleteItem>
        ))}
      </AutocompletePopup>
    </Autocomplete>
  );
}

function ComboboxDemo() {
  const [value, setValue] = useState("");
  const items = ["main", "next", "release/1.2", "dev"];
  return (
    <Combobox
      items={items}
      value={value}
      onValueChange={(next) => setValue(next ?? "")}
      itemToStringValue={(item) => item}
    >
      <ComboboxInput placeholder="Branch…" />
      <ComboboxPopup>
        {items.map((item) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        ))}
      </ComboboxPopup>
    </Combobox>
  );
}

function CommandDemo() {
  const [open, setOpen] = useState(false);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandDialogTrigger render={<Button variant="outline">Command palette</Button>} />
      <Command>
        <CommandItem>Toggle theme</CommandItem>
        <CommandItem>New thread</CommandItem>
        <CommandItem>Open settings</CommandItem>
      </Command>
    </CommandDialog>
  );
}

function ColorPickerDemo() {
  const [hsv, setHsv] = useState({ h: 210, s: 0.7, v: 0.8 });
  return (
    <div className="w-56 space-y-2">
      <ColorSaturationValuePlane label="Color" value={hsv} onChange={setHsv} />
      <ColorHueSlider label="Hue" value={hsv.h} onChange={(h) => setHsv({ ...hsv, h })} />
    </div>
  );
}

function NumberFieldDemo() {
  const [value, setValue] = useState<number | null>(42);
  return (
    <NumberField value={value} onValueChange={setValue}>
      <Label>Workers</Label>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput className="w-16 border-0 bg-transparent text-center" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

export default function App() {
  const [dark, setDark] = useState(
    () => new URLSearchParams(window.location.search).get("theme") === "dark",
  );
  const [checked, setChecked] = useState(true);
  const [theme, setTheme] = useState<string | null>("light");
  const [radio, setRadio] = useState("weekly");
  const [switched, setSwitched] = useState(true);
  const [toggles, setToggles] = useState<string[]>(["bold"]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // The theme's dark tokens are scoped to :root, so the class goes on <html> (like T3 does).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div>
      <div className="bg-background text-foreground min-h-dvh space-y-8 p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">t3-ui gallery</h1>
            <p className="text-muted-foreground text-sm">
              shadcn registry of Base UI components extracted from T3 Code
            </p>
          </div>
          <Button variant="outline" onClick={() => setDark(!dark)}>
            {dark ? "Light" : "Dark"}
          </Button>
        </header>

        <TooltipProvider>
          <div className="grid gap-8 lg:grid-cols-2">
            <Section title="Button">
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="glass">Glass</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="sm">Small</Button>
              <Button size="icon" variant="outline">
                A
              </Button>
            </Section>

            <Section title="Badge">
              <Badge>default</Badge>
              <Badge variant="secondary">secondary</Badge>
              <Badge variant="outline">outline</Badge>
              <Badge variant="error">error</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="label" style={{ "--label": "var(--color-purple-500)" } as never}>
                label
              </Badge>
            </Section>

            <Section title="Input / InputGroup / Textarea">
              <Input placeholder="Plain input" />
              <InputGroup>
                <InputGroupInput placeholder="With addon" />
                <InputGroupAddon>⌘K</InputGroupAddon>
              </InputGroup>
              <Textarea placeholder="Textarea" rows={2} />
            </Section>

            <Section title="Label / Checkbox / Switch / Radio">
              <div className="flex flex-col gap-3">
                <Label className="flex items-center gap-2">
                  <Checkbox checked={checked} onCheckedChange={(c) => setChecked(c === true)} />
                  Checkbox
                </Label>
                <Switch checked={switched} onCheckedChange={setSwitched} />
                <RadioGroup value={radio} onValueChange={setRadio}>
                  <Label className="flex items-center gap-2">
                    <Radio value="daily" /> Daily
                  </Label>
                  <Label className="flex items-center gap-2">
                    <Radio value="weekly" /> Weekly
                  </Label>
                </RadioGroup>
              </div>
            </Section>

            <Section title="Select">
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-40">
                  <SelectValue>Theme</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </Section>

            <Section title="Autocomplete / Combobox">
              <AutocompleteDemo />
              <ComboboxDemo />
            </Section>

            <Section title="Menu / Popover / PreviewCard">
              <Menu>
                <MenuTrigger render={<Button variant="outline">Menu</Button>} />
                <MenuPopup>
                  <MenuItem>Duplicate</MenuItem>
                  <MenuItem>Rename</MenuItem>
                  <MenuItem variant="destructive">Delete</MenuItem>
                </MenuPopup>
              </Menu>
              <Popover>
                <PopoverTrigger render={<Button variant="outline">Popover</Button>} />
                <PopoverPopup>
                  <PopoverTitle>Confirm</PopoverTitle>
                  <p className="text-muted-foreground text-sm">Body text of the popover.</p>
                  <PopoverClose render={<Button size="sm">OK</Button>} />
                </PopoverPopup>
              </Popover>
              <PreviewCard>
                <PreviewCardTrigger render={<Button variant="link">Preview</Button>} />
                <PreviewCardPopup>
                  <div className="p-3 text-sm">Card preview content</div>
                </PreviewCardPopup>
              </PreviewCard>
            </Section>

            <Section title="Dialog / AlertDialog / Sheet">
              <Dialog>
                <DialogTrigger render={<Button>Dialog</Button>} />
                <DialogPopup>
                  <DialogHeader>
                    <DialogTitle>Example dialog</DialogTitle>
                    <DialogDescription>Glass dialog extracted from T3 Code.</DialogDescription>
                  </DialogHeader>
                  <DialogPanel>
                    <p className="text-sm">Content scrolls with the panel.</p>
                  </DialogPanel>
                  <DialogFooter>
                    <DialogClose render={<Button variant="ghost">Cancel</Button>} />
                    <DialogClose render={<Button>Confirm</Button>} />
                  </DialogFooter>
                </DialogPopup>
              </Dialog>
              <AlertDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onOpenChangeComplete={() => {}}
              >
                <AlertDialogPopup>
                  <AlertDialogTitle>Delete thread?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogClose render={<Button variant="ghost">Cancel</Button>} />
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogPopup>
              </AlertDialog>
              <Button variant="outline" onClick={() => setSheetOpen(true)}>
                Sheet
              </Button>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetPopup side="right">
                  <SheetTitle>Sidebar sheet</SheetTitle>
                  <SheetDescription>Mobile-style sheet surface.</SheetDescription>
                </SheetPopup>
              </Sheet>
            </Section>

            <Section title="Command">
              <CommandDemo />
            </Section>

            <Section title="Toggle / ToggleGroup / Kbd">
              <Toggle pressed={false} variant="outline">
                Bold
              </Toggle>
              <ToggleGroup value={toggles} onValueChange={setToggles}>
                <Toggle value="bold">B</Toggle>
                <Toggle value="italic">I</Toggle>
                <Toggle value="underline">U</Toggle>
              </ToggleGroup>
              <KbdGroup>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </Section>

            <Section title="Alert">
              <Alert data-variant="info">
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>A plain informational alert.</AlertDescription>
              </Alert>
              <Alert data-variant="warning" className="alert-glass">
                <AlertTitle>Glass warning</AlertTitle>
                <AlertDescription>Uses the alert-glass utility from the theme.</AlertDescription>
              </Alert>
            </Section>

            <Section title="Group / Separator">
              <Group>
                <Button variant="outline">Left</Button>
                <GroupSeparator />
                <Button variant="outline">Middle</Button>
                <GroupSeparator />
                <Button variant="outline">Right</Button>
              </Group>
              <Separator className="w-40" />
            </Section>

            <Section title="Table / ScrollArea / Skeleton / Spinner">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Build</TableCell>
                    <TableCell>
                      <Spinner />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <ScrollArea className="h-24 w-40">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="text-muted-foreground py-1 text-sm">
                    Row {i + 1}
                  </div>
                ))}
              </ScrollArea>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </Section>

            <Section title="Calendar">
              <Calendar />
            </Section>

            <Section title="Color picker">
              <ColorPickerDemo />
            </Section>

            <Section title="Number field">
              <NumberFieldDemo />
            </Section>

            <Section title="MiddleTruncate / QRCode">
              <div className="w-48">
                <MiddleTruncate value="very-long-project-name-in-a-narrow-sidebar-slot" />
              </div>
              <QRCodeSvg value="https://github.com/Neonity2020/t3-ui" size={96} />
            </Section>

            <Section title="Collapsible / Empty">
              <Collapsible>
                <CollapsibleTrigger render={<Button variant="ghost">Details</Button>} />
                <CollapsiblePanel>
                  <CollapsibleContent className="text-muted-foreground text-sm">
                    Hidden panel content.
                  </CollapsibleContent>
                </CollapsiblePanel>
              </Collapsible>
              <Empty className="w-64">
                <EmptyHeader>
                  <EmptyMedia>◇</EmptyMedia>
                  <EmptyTitle>No threads</EmptyTitle>
                  <EmptyDescription>Start a conversation to see it here.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm">New thread</Button>
                </EmptyContent>
              </Empty>
            </Section>

            <Section title="Tooltip">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                <TooltipPopup>Tooltip content</TooltipPopup>
              </Tooltip>
            </Section>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
