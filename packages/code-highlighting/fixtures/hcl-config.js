import readFile from './_read-file'

// Note: fixture input and output are in
// separate files to make them easier to edit
const fixture = {
  input: readFile('hcl-config_input.txt'),
  output: readFile('hcl-config_output.txt'),
}

export default fixture
