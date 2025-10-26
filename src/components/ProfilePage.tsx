import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";

export function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl text-gray-900 mb-2">Your Profile</h1>
        <p className="text-xl text-gray-600">
          Manage your personal information and preferences.
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="p-8 mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl text-gray-900 mb-1">John Doe</h2>
            <p className="text-gray-600">Member since January 2024</p>
          </div>
          <Button variant="outline">Change Photo</Button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className="p-8 mb-8">
        <h3 className="text-xl text-gray-800 mb-6">Personal Information</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="firstName"
                  defaultValue="John"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="lastName"
                  defaultValue="Doe"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative mt-2">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="phone"
                defaultValue="+1 (555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="address"
                defaultValue="123 Main Street, City, ST 12345"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Employment Information */}
      <Card className="p-8 mb-8">
        <h3 className="text-xl text-gray-800 mb-6">Employment Information</h3>
        <div className="space-y-6">
          <div>
            <Label htmlFor="employer">Employer</Label>
            <div className="relative mt-2">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="employer"
                defaultValue="Tech Company Inc."
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                defaultValue="Software Engineer"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative mt-2">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="startDate"
                  defaultValue="January 2022"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-[#1ABC9C] hover:bg-[#16A085]">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
