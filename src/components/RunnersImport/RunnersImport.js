/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Upload, message, Button, Icon } from 'antd';

class RunnersImport extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.state = {
      files: [],
      uploadResult: null,
    };
  }

  onDrop(files) {
    this.setState({
      files,
    });
  }

  render() {
    let me = this;
    const props = {
      name: 'file',
      action: '/upload',
      headers: {},
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          me.setState({
            uploadResult: info.response,
          });
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div className="dropzone">
        <h1>Import</h1>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
        <div />
        <div>
          {this.state.uploadResult
            ? <ul>
                {this.state.uploadResult.map(item => {
                  <li>
                    {item.name}
                  </li>;
                })}
              </ul>
            : null}
        </div>
      </div>
    );
  }
}
export default RunnersImport;
