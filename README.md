Intellect Solutions is pleased to submit it's prototype Adverse Drug Effects Research System (ADERS) for Development pool (pool two).


URL of the Prototype: https://openfda.intellectsolutions.com - the URL is hosted on an Amazon Web Service (AWS) EC2 Linux instance and operated in accordance with AWS terms of services <<http://aws.amazon.com/legal/>>


URL of the Source Code Repository: https://github.com/IntellectSolutions-GSA-Prototype/OpenFDA_Prototype 


All the source files, installation documentation, readme.md file, supporting documentation, license file, evidence, etc. are uploaded here.


URL of the Docker Container Hub: https://hub.docker.com/u/intellectsolutionsllc/ 


Approach:

Introduction: After reviewing the available APIs, we interviewed sample users and came up a use case that will be useful to our users. Intellect’s prototype is called - Adverse Drug Effects Research System (ADERS). It is designed to provide users with ability to research on adverse side effects of the branded and generic drugs and medical devices. While building the prototype, Intellect followed all the 13 plays from the US Digital Services Playbook to ensure we deliver successful Agile Service prototype to GSA 18F. Each phase below addresses specific plays.

Requirements: Our approach began by studying the prototype requirements and performing research of the APIs. We identified some sample users and conducted interviews with them. After these meetings, our team developed user stories in an open source tool (Taiga.Io) that addressed following requirements: Functionality, Usability 508 compliance, Security and Technical considerations presented by 18F.

User Experience Design: Based on the requirements gathered, we developed high level user stories that describe end-to-end system behavior. We engaged an experienced team member to design user experience, develop mock-ups, create user flows, and address 508 requirements. Our design incorporated research from top-ranked websites for usability to understand latest design elements. Additionally, we reviewed concepts used by 18F on their projects and developed the user experience. Additionally, our prototype includes other elements from US Digital Playbook such as user feedback, and help or instructions.

Technical Design: We chose all the sub-components that make up our prototype to be – modern and reliable tools, increase reusability, open source and low startup cost, and fast turn-around time. Specifically, we used following open-source and modern technologies [Attachment E evidence c], [Attachment E evidence l]: Amazon Web Services (AWS) SaaS hosting provider [Attachment E evidence d], GitHub Source control repository, Taiga.Io for project management and user stories, CentOS virtual server hosted [Attachment E evidence i], Kali Linux platform and Open VAS for vulnerability testing, Angular.js for front-end development, Node.js for back-end development, JSON API specifications.

Development: Team Intellect is adept at agile, having done this for other clients. After reviewing the requirements, gathering user stories by interacting with sample users via interviews and meetings, we quickly organized ourselves to be lean and identified core team members. The work was based around sprints or releases. Initial release focused on developing a working prototype in the short time frame as requested by the government. The prototype uses OpenFDA APIs using REST specifications. Subsequent releases address feedback from unit testing and end user testing, functionality and UI enhancements [Attachment E evidence j]. Team members that supported the development of prototype played following role - Technical Architect, Front End Developer, Back End Developer, and DevOps Engineer [Attachment E evidence a] Technical. Architect played the role of the leader who was responsible for setting the tone of the engagement, execution and overall quality [Attachment E evidence b]. We used text editors to edit code files; preliminary functional testing was performed on local web services running on development workstations; resulting updates were submitted to the GitHub. We also used Docker to create containers [Attachment E evidence i].

For configuration management and code deployment, Taiga.Io integrates with GitHub to check-in, check-out source code, and scripts to update the server with latest source code files [Attachment E evidence f, g]. Additionally, wrote custom scripts to automate the Docker build and running commands.

Testing: We are performing following testing: Functionality testing utilizing JSFilddle.Net, Unit testing [Attachment E evidence e], Performance testing using AWS logs, Security testing using Kali Linux and Open VAS, Automated testing using Firebug and FireEye, Unit Testing manually.

Security and Continuous Monitoring: Security and privacy has played an important role in our approach, Intellect designed its prototype by placing huge emphasis on security. AWS is FedRAMP certified and all the connections supporting latest TLS and only use older TLS for backward compatibility. We use OpenVAS to perform weekly vulnerability scans and address the critical and high vulnerabilities within 15 days [Attachment E evidence h]. As part of our commitment to maintaining privacy, we only capture information necessary to meet functionality of the system. Apache captures IP addresses as part of normal website logging for statistical, performance and security monitoring. AWS provides system level monitoring. This helps us setup alerts, monitor system performance, and make necessary adjustments to the prototype behavior in a timely manner. During development, performance monitoring for query response and page displays were analyzed as per normal functional testing and evaluation and adjustments were made to drop response time to 2-9 ms.
