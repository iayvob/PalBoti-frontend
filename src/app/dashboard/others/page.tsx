import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Users, Mail, Phone, MapPin, Briefcase, Shield } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: "Team | Smart Warehouse Manager",
  description: "View and manage team members working on the PalBoti project",
}

// Mock data for team members
const teamMembers = [
  {
    id: "TM-001",
    name: "Alex Johnson",
    role: "Mechatronics Engineer",
    email: "alex.johnson@palboti.com",
    phone: "+1 (555) 123-4567",
    location: "Engineering Lab",
    image: "/placeholder.svg?height=100&width=100",
    tags: ["supervisor"],
    expertise: ["Robotics", "Control Systems", "Automation"],
  },
  {
    id: "TM-002",
    name: "Sarah Chen",
    role: "Mechatronics Engineer",
    email: "sarah.chen@palboti.com",
    phone: "+1 (555) 234-5678",
    location: "Engineering Lab",
    image: "/placeholder.svg?height=100&width=100",
    tags: [],
    expertise: ["Mechanical Design", "Prototyping", "Testing"],
  },
  {
    id: "TM-003",
    name: "Michael Rodriguez",
    role: "Mechatronics Engineer",
    email: "michael.rodriguez@palboti.com",
    phone: "+1 (555) 345-6789",
    location: "Engineering Lab",
    image: "/placeholder.svg?height=100&width=100",
    tags: [],
    expertise: ["Sensors", "Actuators", "Integration"],
  },
  {
    id: "TM-004",
    name: "Priya Patel",
    role: "Embedded Systems Engineer",
    email: "priya.patel@palboti.com",
    phone: "+1 (555) 456-7890",
    location: "Electronics Lab",
    image: "/placeholder.svg?height=100&width=100",
    tags: ["technical"],
    expertise: ["Firmware", "MQTT", "Real-time Systems"],
  },
  {
    id: "TM-005",
    name: "David Kim",
    role: "AI Engineer",
    email: "david.kim@palboti.com",
    phone: "+1 (555) 567-8901",
    location: "Data Center",
    image: "/placeholder.svg?height=100&width=100",
    tags: ["technical"],
    expertise: ["Machine Learning", "Computer Vision", "Data Analysis"],
  },
]

export default function OthersPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-primary">Team Management</h1>
            <p className="text-muted-foreground">View and manage team members working on the PalBoti project</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-primary hover:bg-primary/90">Contact Team</Button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Team Members
          </CardTitle>
          <CardDescription>PalBoti project team with roles and expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              Supervisor
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Technical
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex p-4">
                    <div className="mr-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-primary">{member.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.tags.includes("supervisor") && (
                          <Badge
                            variant="outline"
                            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 text-xs"
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Supervisor
                          </Badge>
                        )}
                        {member.tags.includes("technical") && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs"
                          >
                            <Briefcase className="h-3 w-3 mr-1" />
                            Technical
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t px-4 py-3 bg-secondary/10">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center text-xs">
                        <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t px-4 py-3">
                    <h4 className="text-xs font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
