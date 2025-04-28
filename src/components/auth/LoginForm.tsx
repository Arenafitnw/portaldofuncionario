
import React, { useState } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    onLogin(username, password);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-white text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gradient-background">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-center">
        <div className="flex flex-col items-center">
          <img 
            src="https://i.ibb.co/k6QPjdV0/logo-1.png" 
            alt="Arena Fit" 
            className="h-16 mb-2"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-white">Portal do Funcionário</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md glassmorphism animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-primary-700">Login</CardTitle>
            <CardDescription className="text-center">
              Acesse o portal com suas credenciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input 
                  id="username" 
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handleSubmit}
            >
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-3 text-center text-white/80 text-sm">
        &copy; {new Date().getFullYear()} Arena Fit - Todos os direitos reservados
      </footer>
    </div>
  );
};

export default LoginForm;
