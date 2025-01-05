import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FlowEditor } from "@/components/FlowEditor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Save, Play, Plus, X, Send, Github } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Example personality traits for placeholders
const EXAMPLE_TRAITS = [
  "Creative",
  "Analytical",
  "Empathetic",
  "Humorous",
  "Professional",
  "Supportive",
  "Knowledgeable",
  "Patient",
  "Enthusiastic",
  "Detail-oriented"
];

interface TraitInput {
  value: string;
  placeholder: string;
}

interface AgentForm {
  name: string;
  description: string;
  personality_traits: string[];
  image_url: string;
  voice_type: string;
  temperature: number;
}

export function AgentBuilder() {
  const { id } = useParams();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [telegramToken, setTelegramToken] = useState("");
  const [showTelegramInstructions, setShowTelegramInstructions] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [githubRepoName, setGithubRepoName] = useState("");
  const [showGithubDialog, setShowGithubDialog] = useState(false);

  const form = useForm<AgentForm>({
    defaultValues: {
      name: "",
      description: "",
      personality_traits: [],
      image_url: "",
      voice_type: "male", //default to male
      temperature: 70
    }
  });

  const { data: agent } = useQuery({
    queryKey: [`/api/agents/${id}`],
    enabled: !!id
  });

  function getRandomTraitExample(usedTraits: string[]) {
    const availableTraits = EXAMPLE_TRAITS.filter(trait => !usedTraits.includes(trait));
    return availableTraits[Math.floor(Math.random() * availableTraits.length)] || "Adaptive";
  }

  const [traitInputs, setTraitInputs] = useState<TraitInput[]>([{
    value: '',
    placeholder: getRandomTraitExample([])
  }]);

  const addTraitInput = () => {
    const currentTraits = form.getValues("personality_traits");
    setTraitInputs([...traitInputs, {
      value: '',
      placeholder: getRandomTraitExample([...currentTraits, ...traitInputs.map(t => t.value).filter(Boolean)])
    }]);
  };

  const updateTraitInput = (index: number, value: string) => {
    const newInputs = [...traitInputs];
    newInputs[index].value = value;
    setTraitInputs(newInputs);
  };

  const addTrait = (trait: string, index: number) => {
    if (trait.trim()) {
      const currentTraits = form.getValues("personality_traits");
      if (!currentTraits.includes(trait)) {
        form.setValue("personality_traits", [...currentTraits, trait]);
        // Clear the input after adding
        const newInputs = [...traitInputs];
        newInputs[index].value = '';
        setTraitInputs(newInputs);
      }
    }
  };

  const removeTrait = (traitToRemove: string) => {
    const currentTraits = form.getValues("personality_traits");
    form.setValue(
      "personality_traits",
      currentTraits.filter(trait => trait !== traitToRemove)
    );
  };

  const createTelegramBot = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/agents/${id}/telegram-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...form.getValues(),
          telegram_token: telegramToken 
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Telegram bot created successfully!",
      });
      setShowTelegramInstructions(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const exportToGithub = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/agents/${id}/export-github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...form.getValues(),
          github_token: githubToken,
          repo_name: githubRepoName
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Agent exported to GitHub successfully. Repository URL: ${data.repo_url}`,
      });
      setShowGithubDialog(false);
      setGithubToken("");
      setGithubRepoName("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="mb-4">
        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My AI Agent" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your agent's purpose and capabilities..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personality_traits"
                  render={() => (
                    <FormItem>
                      <FormLabel>Personality Traits</FormLabel>
                      <div className="space-y-2">
                        {traitInputs.map((input, index) => (
                          <div key={index}>
                            <Input
                              value={input.value}
                              onChange={(e) => updateTraitInput(index, e.target.value)}
                              placeholder={`Add trait (e.g., ${input.placeholder})`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addTrait(input.value, index);
                                }
                              }}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addTraitInput}
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Another Trait
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch("personality_traits").map((trait, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {trait}
                            <button
                              type="button"
                              onClick={() => removeTrait(trait)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.png" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voice_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="robot">Robot</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creativity Level</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value}% - {field.value < 30 ? "More focused and consistent" :
                          field.value < 70 ? "Balanced creativity" : "More creative and varied"}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) {
                  setShowTelegramInstructions(false);
                  setTelegramToken("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Send className="mr-2 h-4 w-4" />
                    Create Telegram Bot
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Telegram Bot</DialogTitle>
                    <DialogDescription>
                      Create a new Telegram bot using your agent's configuration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {!showTelegramInstructions ? (
                      <>
                        <div className="space-y-4">
                          <h3 className="font-medium">Follow these steps to get your Telegram Bot Token:</h3>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Open Telegram and search for "@BotFather"</li>
                            <li>Start a chat with BotFather and send the command "/newbot"</li>
                            <li>Follow the instructions to choose a name and username for your bot</li>
                            <li>BotFather will give you a token that looks like "123456789:ABCdefGHIjklmNOPQrstUVwxyz"</li>
                            <li>Copy that token and paste it below</li>
                          </ol>
                          <FormItem>
                            <FormLabel>Telegram Bot Token</FormLabel>
                            <FormControl>
                              <Input
                                value={telegramToken}
                                onChange={(e) => setTelegramToken(e.target.value)}
                                placeholder="Enter your Telegram bot token"
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        <Button 
                          onClick={() => createTelegramBot.mutate()}
                          disabled={createTelegramBot.isPending || !telegramToken}
                        >
                          {createTelegramBot.isPending ? "Creating..." : "Create Bot"}
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="font-medium">Great! Your Telegram bot has been created. Here's how to use it:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                          <li>Search for your bot on Telegram using the username you chose</li>
                          <li>Start a chat with your bot by clicking "Start"</li>
                          <li>Your bot is now ready to interact using the personality and workflow you've configured</li>
                          <li>You can modify the bot's behavior anytime by updating the agent configuration</li>
                        </ol>
                        <Button onClick={() => setDialogOpen(false)}>Close</Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showGithubDialog} onOpenChange={(open) => {
                setShowGithubDialog(open);
                if (!open) {
                  setGithubToken("");
                  setGithubRepoName("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    disabled={exportToGithub.isPending}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Export to GitHub
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Export to GitHub</DialogTitle>
                    <DialogDescription>
                      Export your agent configuration to a GitHub repository
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Follow these steps to export to GitHub:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Go to GitHub Settings → Developer Settings → Personal Access Tokens</li>
                        <li>Generate a new token with 'repo' scope</li>
                        <li>Copy the generated token and paste it below</li>
                        <li>Choose a name for your new repository</li>
                      </ol>
                      <FormItem>
                        <FormLabel>GitHub Personal Access Token</FormLabel>
                        <FormControl>
                          <Input
                            value={githubToken}
                            onChange={(e) => setGithubToken(e.target.value)}
                            placeholder="Enter your GitHub token"
                            type="password"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Repository Name</FormLabel>
                        <FormControl>
                          <Input
                            value={githubRepoName}
                            onChange={(e) => setGithubRepoName(e.target.value)}
                            placeholder="e.g., my-ai-agent"
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <Button 
                      onClick={() => exportToGithub.mutate()}
                      disabled={exportToGithub.isPending || !githubToken || !githubRepoName}
                    >
                      {exportToGithub.isPending ? "Exporting..." : "Export to GitHub"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>

              <Button className="bg-primary hover:bg-primary/90">
                <Play className="mr-2 h-4 w-4" />
                Test
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Card className="flex-1 p-4 bg-background/50">
        <FlowEditor />
      </Card>
    </div>
  );
}