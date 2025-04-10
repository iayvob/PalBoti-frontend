import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Users, Mail, Phone, MapPin, ArrowLeft, Edit, Calendar, FileText, Shield, Briefcase } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Team Member ${params.id} | Smart Warehouse Manager`,
    description: "Detailed information about this team member",
  }
}

// Mock function to get team member by ID
function getTeamMemberById(id: string) {
  const teamMembers = {
    "TM-001": {
      id: "TM-001",
      name: "Alex Johnson",
      role: "Mechatronics Engineer",
      email: "alex.johnson@palboti.com",
      phone: "+1 (555) 123-4567",
      location: "Engineering Lab",
      image: "/placeholder.svg?height=200&width=200",
      tags: ["supervisor"],
      expertise: ["Robotics", "Control Systems", "Automation"],
      department: "Engineering",
      joinDate: "2023-05-15",
      projects: ["Robot Navigation System", "Sensor Integration", "Warehouse Automation"],
      education: "M.S. in Mechatronics Engineering, Stanford University",
      bio: "Alex has over 8 years of experience in robotics and automation systems. He specializes in designing and implementing control systems for autonomous robots in industrial settings.",
    },
    "TM-004": {
      id: "TM-004",
      name: "Priya Patel",
      role: "Embedded Systems Engineer",
      email: "priya.patel@palboti.com",
      phone: "+1 (555) 456-7890",
      location: "Electronics Lab",
      image: "/placeholder.svg?height=200&width=200",
      tags: ["technical"],
      expertise: ["Firmware", "MQTT", "Real-time Systems", "IoT", "Embedded Linux"],
      department: "Engineering",
      joinDate: "2023-08-10",
      projects: ["Robot Firmware Development", "Communication Protocols", "Sensor Integration"],
      education: "B.S. in Electrical Engineering, MIT",
      bio: "Priya is an expert in embedded systems with a focus on real-time applications. She has developed firmware for various IoT devices and specializes in optimizing communication protocols for warehouse robots.",
    },
  }

  return teamMembers[id as keyof typeof teamMembers] || null
}

export default function TeamMemberDetailPage({ params }: { params: { id: string } }) {
  const member = getTeamMemberById(params.id)

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Team Member Not Found</h1>
        <p className="text-muted-foreground mb-4">
          The team member you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/others">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/others">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">{member.name}</h1>
            <p className="text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Contact</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary mb-4">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{member.name}</h2>
                <p className="text-primary">{member.role}</p>
                <div className="flex gap-2 mt-2">
                  {member.tags.includes("supervisor") && (
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Supervisor
                    </Badge>
                  )}
                  {member.tags.includes("technical") && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Technical
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.department}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Joined {member.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{member.bio}</p>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Education</h3>
                  <p>{member.education}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {member.projects.map((project, index) => (
                    <div key={index} className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="font-medium">{project}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Projects
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
